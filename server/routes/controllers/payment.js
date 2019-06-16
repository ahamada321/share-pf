const { normalizeErrors } = require('./helpers/mongoose')
const Booking = require('./models/booking')
const Payment = require('./models/payment')
const Rental = require('./models/rental')
//const User = require('./models/user')
const moment = require('moment-timezone')

const config = require('../../config')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(config.SENDGRID_API_KEY);

const stripe = require('stripe')(config.STRIPE_SK)


const REQUEST_DECLINED = 'request_declined'
const REQUEST_ACCEPTED = 'request_accepted'

function sendEmailTo(sendTo, sendMsg, booking, hostname) {
    let msg = {}
    const startAt = moment(booking.startAt).tz("Asia/Tokyo").format("YYYY/MM/DD/HH:mm")
    const endAt = moment(booking.endAt).tz("Asia/Tokyo").format("HH:mm")

    if(sendMsg == REQUEST_DECLINED) {
        msg = {
            to: sendTo,
            from: "noreply@ap-trainer.com",
            subject: "「" + booking.rental.rentalname + " Trainer」への予約リクエストは受理されませんでした",
            text: "商品名：" + booking.rental.rentalname + " \n\n"
                + "日時：" + startAt + ' 〜 ' + endAt + " \n\n"
                + "場所：" + booking.rental.province + "\n\n"
                + "への予約リクエストは受理されませんでした。たまたま「" + booking.rental.rentalname + " Trainer」の都合がつかなかった場合もありますので、また別の日程で予約にチャレンジしてみてください！\n\n"
                + "他の商品の方が予約しやすい場合もあります。"
                + '\n\n\n\n'
                + 'AnytimePersonalTrainer.inc'
        }
    } else if (sendMsg == REQUEST_ACCEPTED) {
        msg = {
            to: sendTo,
            from: "noreply@ap-trainer.com",
            subject: "[予約確定]「" + booking.rental.rentalname + " Trainer」への予約リクエストが受理されました！",
            text: 'おめでとうございます！「' + booking.rental.rentalname + ' Trainer」への予約リクエストが受理されました！\n\n' 
                + '日時：' + startAt + ' 〜 ' + endAt + ' \n\n'
                + '場所：' + booking.rental.province + '\n\n'
                + 'これ以降のキャンセルはできません。時間に余裕を持って目的地に到着されるようお願いいたします。'
                + '\n\n\n\n'
                + 'AnytimePersonalTrainer.inc'
        }
    } else {
        return res.status(422).send({errors: [{title: "Could not send email!", detail: "Please select appropriate email content!"}]})
    }
    
    sgMail.send(msg);
}

exports.getPendingPayments = function(req, res) {
    const user = res.locals.user

    Payment.where({toUser: user})
            .where({status: 'pending'})
            .populate({
                // populate both 'booking' and 'rental'
                path: 'booking',
                populate: {path: 'rental'}
            })
            .populate('fromUser')
            .exec(function(err, foundPayments) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }
        return res.json(foundPayments)
    })
}

exports.getPaidPayments = function(req, res) {
    const user = res.locals.user

    Payment.where({toUser: user})
            .where({status: 'paid'})
            .populate({
                // populate both 'booking' and 'rental'
                path: 'booking',
                populate: {path: 'rental'}
            })
            .select('-fromStripeCustomerId -tokenId')
            .populate('fromUser')
            .exec(function(err, foundPaidPayments) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }
        return res.json(foundPaidPayments)
    })
}

exports.acceptPayment = function(req, res) {
    const payment = req.body
    const user = res.locals.user

    Payment.findById(payment._id)
            .populate('toUser')
            .populate({
                // populate both 'booking' and 'rental'
                path: 'booking',
                populate: {path: 'rental'}
            })
            .exec(async function(err, foundPayment) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }

        if(foundPayment.status == 'pending' && user.id == foundPayment.toUser.id) {
            const booking = foundPayment.booking

            // It will charge to booking user when owner accept payment.
            // This charge is not directly going to rental owner, but paid to platform owner.
            // Platform owner have to pay to rental owner manually considering commision rate.
            const charge = await stripe.charges.create({
                amount: booking.totalPrice,
                currency: 'jpy',
                customer: payment.fromStripeCustomerId
            })

            if(charge) {
                Booking.updateMany({ _id: booking}, { status: 'active'}, function(){})

                foundPayment.charge = charge
                foundPayment.status = 'paid'
                foundPayment.paidAt = new Date()
                foundPayment.save(function(err) {
                    if(err) {
                        return res.status(422).send({errors: normalizeErrors(err.errors)})
                    }
                    sendEmailTo(payment.fromUser.email, REQUEST_ACCEPTED, booking, req.hostname)
                    return res.json({ status: 'paid'})


                    // User.updateMany({_id: foundPayment.toUser}, { $inc: {revenue: foundPayment.amount}}, function(err, user) {
                    //     if(err) {
                    //         return res.status(422).send({errors: normalizeErrors(err.errors)})
                    //     }
                    //     sendEmailTo(payment.fromUser.email, ACCEPTED)
                    //     return res.json({ status: 'paid'})
                    // })
                })
            }
        }
    })
}

exports.declinePayment = function(req, res) {
    const payment = req.body
    const { booking } = req.body

    Booking.deleteOne({id: booking._id}, (err) => { // Delete Booking
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }

        sendEmailTo(payment.fromUser.email, REQUEST_DECLINED, booking, req.hostname)

        Payment.updateMany({_id: payment._id}, {status: 'declined'}, function(){})
        Rental.updateMany({_id: booking.rental}, {$pull: {bookings: booking._id}}, ()=>{}) // Delete Booking from Rental

        return res.json({status: 'deleted'})
    })

}