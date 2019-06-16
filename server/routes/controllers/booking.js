const { normalizeErrors } = require('./helpers/mongoose')
const Booking = require('./models/booking')
const Payment = require('./models/payment')
const Rental = require('./models/rental')
const User = require('./models/user')
const moment = require('moment-timezone')

const config = require('../../config')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(config.SENDGRID_API_KEY);

const stripe = require('stripe')(config.STRIPE_SK)
const CUSTOMER_SHARE = 0.7

const REQUEST_SEND = 'request_send'
const REQUEST_RECIEVED = 'request_recieved'

function sendEmailTo(sendTo, sendMsg, booking, hostname) {
    let msg = {}
    const startAt = moment(booking.startAt).tz("Asia/Tokyo").format("YYYY/MM/DD/HH:mm")
    const endAt = moment(booking.endAt).tz("Asia/Tokyo").format("HH:mm")

    if(sendMsg == REQUEST_SEND) {
        msg = {
            to: sendTo,
            from: 'noreply@ap-trainer.com',
            subject: '[仮予約完了]予約リクエストを送信しました！',
            text: '現時点では予約は確定していません。「' + booking.rental.rentalname + ' Trainer」がリクエストを受理された場合に正式予約が完了します。\n\n'
                + '予約が確定しない限りご請求が行くことはございません。'
                + '\n\n\n\n'
                + 'AnytimePersonalTrainer.inc'
        }
    } else if (sendMsg == REQUEST_RECIEVED) {
        msg = {
            to: sendTo,
            from: 'noreply@ap-trainer.com',
            subject: '「' + booking.rental.rentalname + ' Trainer」に予約リクエストが来ています！',
            text: '「' + booking.rental.rentalname + '」への予約リクエストが以下の日時で来ています。受理されますか？\n\n'
                + '日時：' + startAt + ' 〜 ' + endAt + '\n\n'
                + '場所：' + booking.rental.province + '\n\n'
                + '以下のURLからログインして、受理/否認のご連絡をお願いいたします。\n\n'
                + 'URL：' +  "https:\/\/" + hostname + '\/rentals\/requests'
                + '\n\n\n\n'
                + 'AnytimePersonalTrainer.inc'
        }
    } else {
        return res.status(422).send({errors: [{title: "Could not send email!", detail: "Please select appropriate email content!"}]})
    }

     sgMail.send(msg);
}


async function createPayment(booking, toUser, paymentToken = null) {
    const { user } = booking
    let customer

    if (paymentToken) { // It means first time payment or, user changed credit card
        if(user.customer.id) { // If user wanna pay with different card as before
            customer = await stripe.customers.update(user.customer.id, {
                source: paymentToken.id
            }) 
        } else {
            customer = await stripe.customers.create({
                email: user.email,
                source: paymentToken.id
            })
        }
        User.updateMany({_id: user.id}, {$set: {customer: customer}}, () => {})

        // Store booking user paymentToken and email to charge later.
        const payment = new Payment({
            fromUser: user,
            toUser,
            fromStripeCustomerId: customer.id,
            booking,
            // tokenId: paymentToken.id,
            ownerRevenue: booking.totalPrice * CUSTOMER_SHARE
        })  

        try {
            const savePayment = await payment.save()
            return {payment: savePayment}
        } catch(err) {
            return {err: err.message}
        }
    } else if(user.customer.id) { // If user wanna pay with same card as before
        // Store booking user paymentToken and email to charge later.
        const payment = new Payment({
            fromUser: user,
            toUser,
            fromStripeCustomerId: user.customer.id,
            booking,
            // tokenId: user.customer.default_source,
            ownerRevenue: booking.totalPrice * CUSTOMER_SHARE
        })    

        try {
            const savePayment = await payment.save()
            return {payment: savePayment}
        } catch(err) {
            return {err: err.message}
        }
    }
    
    return {err: 'Can not process Payment!'}
}

function isValidBooking(requestBooking, rentalBookings) {
    let isValid = true
    if(rentalBookings && rentalBookings.length > 0) {

        isValid = rentalBookings.every(function(booking) {
            const reqStart = moment(requestBooking.startAt)
            const reqEnd = moment(requestBooking.endAt)
            const acturalStart = moment(booking.startAt)
            const acturalEnd = moment(booking.endAt)

            return ((acturalStart<reqStart && acturalEnd<reqStart) || (reqEnd<acturalStart && reqEnd<acturalEnd)) 

        })
    }
    return isValid
}

exports.createDateBlockBooking = function(req, res) {
    const { startAt, endAt, rental } = req.body
    const user = res.locals.user

    const booking = new Booking({ startAt, endAt })

    Rental.findById(rental._id)
                    .populate('bookings')
                    .populate('user')
                    .exec(function(err, foundRental) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }

        if(foundRental.user.id !== user.id){
            return res.status(422).send({errors: [{title: "Invalid user!", detail: "Dayblock can be made by Rental Owner only!"}]})
        }

        booking.user = user
        booking.status = 'block'
        booking.rental = foundRental
        foundRental.bookings.push(booking)
                
        booking.save(function(err, result) {
            if(err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)})
            }

            foundRental.save()
            return res.json(result.id)
        })
    })
}

exports.createBooking = function(req, res) {
    // Passed booking information from booking.component.ts
    const { startAt, endAt, days, courseTime, totalPrice, rental, paymentToken } = req.body
    const user = res.locals.user

    const booking = new Booking({ startAt, endAt, days, courseTime, totalPrice })

    Rental.findById(rental._id)
                    .populate('bookings')
                    .populate('user')
                    .exec(async function(err, foundRental) {

        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }

        if(foundRental.user.id == user.id){
            return res.status(422).send({errors: [{title: "Invalid user!", detail: "Cannot make booking on your Rentals!"}]})
        }

        if(isValidBooking(booking, foundRental.bookings)) {
            booking.user = user
            booking.rental = foundRental
            const { err, payment } = await createPayment(booking, foundRental.user, paymentToken)

            if(err) {
                return res.status(422).send({errors: [{title: "Payment error!", detail: err}]})
            }
            if(payment){
                booking.payment = payment
                foundRental.bookings.push(booking)
                
                booking.save(function(err) {
                    if(err) {
                        return res.status(422).send({errors: normalizeErrors(err.errors)})
                    }

                    // Send notification to both of users.
                    sendEmailTo(user.email, REQUEST_SEND, booking, req.hostname)
                    sendEmailTo(foundRental.user.email, REQUEST_RECIEVED, booking, req.hostname)

                    foundRental.save()
                    User.updateMany({_id: user.id}, {$push: {bookings: booking}}, function(){})
                    return res.json({startAt: booking.startAt, endAt: booking.endAt})
                })
            }
        } else {
           return res.status(422).send({errors: [{title: "Invalid booking!", detail: "Chosed dates are already taken!"}]})
        }
    })
}

exports.deleteBooking = function(req, res) { // Under development! Not working yet!
    const user = res.locals.user

    Booking.findById(req.params.id) 
    .populate('user')
    .populate('rental')
    // .populate('startAt')
    .exec(function(err, foundBooking) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }
        if(foundBooking.user.id != user.id) {
            return res.status(422).send({
                errors: {
                    title: "Invalid request!",
                    detail: "You cannot delete other users booking!"
                }
            })
        }
        if(foundBooking.status == 'active') {
            return res.status(422).send({
                errors: {
                    title: "Invalid request!",
                    detail: "Cannot delete active booking!"
                }
            })
        }
        foundBooking.remove(function(err) {
            if (err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)})
            }
            Rental.updateMany({_id: foundBooking.rental.id}, {$pull: {bookings: foundBooking.id}}, ()=>{}) // Delete Booking from Rental
            User.updateMany({ _id: foundBooking.user.id}, {$pull: {bookings: foundBooking.id}}, ()=>{}) // Delete Booking from User
    
            return res.json({"status": "deleted"})
        })
    })
}

exports.getUserBookings = function(req,res) {
    const user = res.locals.user

    Booking.where({user})
            .populate('rental')
            .exec(function(err, foundBookings) {
                if(err) {
                    return res.status(422).send({errors: normalizeErrors(err.errors)})
                }
                return res.json(foundBookings)
    })
}
