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
            from: 'test@example.com',
            subject: '[仮予約完了]予約リクエストを送信しました！',
            text: '現時点では予約は確定していません。「' + booking.rental.rentalname + '」オーナーがリクエストを受理された場合に正式予約が完了します。\n\n'
                + '予約が確定しない限りクレジットカードに請求されることはありません。'
        }
    } else if (sendMsg == REQUEST_RECIEVED) {
        msg = {
            to: sendTo,
            from: 'test@example.com',
            subject: '「' + booking.rental.rentalname + '」への予約リクエストが来ています！',
            text: 'あなたの「' + booking.rental.rentalname + '」への予約リクエストが以下の日時で来ています。受理されますか？\n\n'
                + '日時：' + startAt + ' 〜 ' + endAt + '\n\n'
                + '場所：' + booking.rental.province + '\n\n'
                + '以下のURLからログインして、受理/否認のご連絡をお願いいたします。\n\n'
                + 'URL：' +  "http:\/\/" + hostname + '\/requests'
        }
    } else {
        return res.status(422).send({errors: [{title: "Could not send email!", detail: "Please select appropriate email content!"}]})
    }

     sgMail.send(msg);
}




async function createPayment(booking, toUser, paymentToken) {
    const { user } = booking
    let customer

    if (paymentToken) {
        // Store booking user paymentToken and email to charge later.
        customer = await stripe.customers.create({
            source: paymentToken.id,
            email: user.email
        })
        User.updateMany({_id: user.id}, {$set: {stripeCustomerId: customer.id}}, () => {})
    } else {
        customer.id = user.stripeCustomerId
    }

    if(customer) {
        const payment = new Payment({
            fromUser: user,
            toUser,
            fromStripeCustomerId: customer.id,
            booking,
            tokenId: paymentToken.id,
            amount: booking.totalPrice * CUSTOMER_SHARE
        })

        try {
            const savePayment = await payment.save()
            return {payment: savePayment}
        } catch(err) {
            return {err: err.message}
        }
    } else {
        return {err: 'Can not process Payment!'}
    }
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

            if(user.isAutoBooking) {
                //booking.payment.status = 'autobooking' // Fix me!
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
            } else {
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
            }

        } else {
           return res.status(422).send({errors: [{title: "Invalid booking!", detail: "Chosed dates are already taken!"}]})
        }
    })
}

exports.deleteBooking = function(req, res) { // Under development! Not working yet!
    const user = res.locals.user

    // Rental.findById(rental._id)
    //                 .populate('bookings')
    //                 .populate('user')
    //                 .exec(async function(err, foundRental) {

    //     if(err) {
    //         return res.status(422).send({errors: normalizeErrors(err.errors)})
    //     }

    //     if(foundRental.user.id == user.id){
    //         return res.status(422).send({errors: [{title: "Invalid user!", detail: "Cannot make booking on your Rentals!"}]})
    //     }
                
    // })


//やること→　bookingIDを直で渡せる→　それを元にBookingを削除できる→　その前にrental.bookingも削除したい。←　booking.rental.idでfoundrentalして、bookingを削除？


    Booking.findById(req.params.id) 
            .populate('user', '_id')
            .populate('rental')
             .populate({
                path: 'bookings',
                select: '_id',
            // //     match: { startAt: { $gt: new Date()}} // &gt: greater than. <- Pick up future than now.
             })
            .exec(function(err, foundBooking) {
                if(err) {
                    return res.status(422).send({errors: normalizeErrors(err.errors)})
                }
                if(user.id != foundBooking.user.id) {
                    return res.status(422).send({
                        errors: {
                            title: "Invalid user!",
                            detail: "You are not booking user!"
                        }
                    })
                }


                //foundBooking.rental.bookings

                //foundRental.bookings.push(booking) //の逆をする
                const index = foundBooking.rental.bookings.array.indexOf(req.params.id)
                foundRental.bookings.splice(foundRental.bookings.array.indexOf(req.params.id), 1)



                foundBooking.remove(function(err) {
                    if (err) {
                        return res.status(422).send({errors: normalizeErrors(err.errors)})
                    }
                    return res.json({"status": "booking deleted"})
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
