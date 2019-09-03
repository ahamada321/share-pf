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

const REQUEST_DECLINED_BY_OWNER = 'request_declined_by_owner'
const REQUEST_ACCEPTED_BY_OWNER = 'request_accepted_by_owner'
const REQUEST_DECLINED_BY_USER = 'request_declined_by_user'
const REQUEST_ACCEPTED_BY_USER = 'request_accepted_by_user'


function sendEmailTo(sendTo, sendMsg, booking, hostname, comment) {
    let msg = {}
    const startAt = moment(booking.startAt).tz("Asia/Tokyo").format("YYYY/MM/DD/HH:mm")
    const endAt = moment(booking.endAt).tz("Asia/Tokyo").format("HH:mm")

    if(sendMsg === REQUEST_DECLINED_BY_OWNER) {
        if(comment) {
            msg = {
                to: sendTo,
                from: "noreply@ap-trainer.com",
                subject: "「" + booking.rental.rentalname + " Trainer」への予約リクエストは受理されませんでした",
                text: "商品名：" + booking.rental.rentalname + " \n\n"
                    + "日時：" + startAt + ' 〜 ' + endAt + " \n\n"
                    + "場所：" + booking.rental.province + "\n\n"
                    + "への予約リクエストは受理されませんでした。\n\n"
                    + '先生からのコメント：' + comment
                    + '\n\n\n\n'
                    + 'Aeru.me, Inc'
            }
        } else {
            msg = {
                to: sendTo,
                from: "noreply@ap-trainer.com",
                subject: "「" + booking.rental.rentalname + " Trainer」への予約リクエストは受理されませんでした",
                text: "商品名：" + booking.rental.rentalname + " \n\n"
                    + "日時：" + startAt + ' 〜 ' + endAt + " \n\n"
                    + "場所：" + booking.rental.province + "\n\n"
                    + "への予約リクエストは受理されませんでした。\n\n"
                    + "たまたま「" + booking.rental.rentalname + " Trainer」の都合がつかなかった場合もありますので、また別の日程で予約にチャレンジしてみてください！\n\n"
                    + "他の商品の方が予約しやすい場合もあります。"
                    + '\n\n\n\n'
                    + 'Aeru.me, Inc'
            }
        }
    } else if (sendMsg === REQUEST_ACCEPTED_BY_OWNER) {
        msg = {
            to: sendTo,
            from: "noreply@ap-trainer.com",
            subject: "[予約確定]「" + booking.rental.rentalname + " Trainer」への予約リクエストが受理されました！",
            text: 'おめでとうございます！「' + booking.rental.rentalname + ' Trainer」への予約リクエストが受理されました！\n\n' 
                + '日時：' + startAt + ' 〜 ' + endAt + ' \n\n'
                + '場所：' + booking.rental.province + '\n\n'
                + 'これ以降のキャンセルはできません。時間に余裕を持って目的地に到着されるようお願いいたします。'
                + '\n\n\n\n'
                + 'Aeru.me, Inc'
        }
    } else if (sendMsg === REQUEST_ACCEPTED_BY_USER) {
        msg = {
            to: sendTo,
            from: "noreply@ap-trainer.com",
            subject: "[予約確定]「" + booking.rental.rentalname + " Trainer」への予約日時変更リクエストが受理されました！",
            text: 'おめでとうございます！「' + booking.rental.rentalname + ' Trainer」の予約日時変更リクエストが受理されました！\n\n' 
                + '日時：' + startAt + ' 〜 ' + endAt + ' \n\n'
                + '場所：' + booking.rental.province + '\n\n'
                + 'これ以降のキャンセルはできません。生徒に満足される最高のおもてなしをしましょう！'
                + '\n\n\n\n'
                + 'Aeru.me, Inc'
        }
    } else if (sendMsg === REQUEST_DECLINED_BY_USER) {
        msg = {
            to: sendTo,
            from: "noreply@ap-trainer.com",
            subject: "「" + booking.rental.rentalname + " Trainer」への予約日時変更リクエストは受理されませんでした",
            text: "商品名：" + booking.rental.rentalname + " \n\n"
                + "日時：" + startAt + ' 〜 ' + endAt + " \n\n"
                + "場所：" + booking.rental.province + "\n\n"
                + "への予約日時変更リクエストは受理されませんでした。\n\n"
                + "せっかくの予約機会を逃さぬよう、受付不可日はなるべく早めに予約ブロック機能で事前にブロックしておきましょう。\n\n"
                + "予約ブロック機能はTrainer管理ページ内で設定できます。"
                + '\n\n\n\n'
                + 'Aeru.me, Inc'
        }
    } else {
        return res.status(422).send({errors: [{title: "Could not send email!", detail: "Please select appropriate email content!"}]})
    }
    
    sgMail.send(msg);
}

exports.getPendingPayments = function(req, res) {
    const user = res.locals.user

    Payment.where({toUser: user, status: 'pending'})
            .populate('fromUser')
            .populate({
                // populate both 'booking' and 'rental'
                path: 'booking',
                // options: {sort: {'startAt': -1}}, // This not works
                populate: {
                    path: 'rental',
                    populate: {path: 'bookings'} // Using for reproposal booking date from rental owner.
                }
            })
            .sort( {'booking.startAt': -1} ) // This not works
            .exec(function(err, foundPayments) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }
        return res.json(foundPayments)
    })
}

exports.getPaidPayments = function(req, res) {
    const user = res.locals.user

    Payment.where({toUser: user, status: 'paid'})
            .populate('fromUser')
            .populate({
                // populate both 'booking' and 'rental'
                path: 'booking',
                populate: {path: 'rental'}
            })
            .select('-fromStripeCustomerId -tokenId')
            .exec(function(err, foundPaidPayments) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }
        return res.json(foundPaidPayments)
    })
}

exports.acceptPayment = function(req, res) {
    const payment  = req.body
    const user = res.locals.user

    Payment.findById(payment._id)
            .populate('fromUser')
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

        if(foundPayment.status !== 'pending') {
            return res.status(422).send({errors: [{title: "Invalid request!", detail: "This payment is already paid or canseled!"}]})
        }

        if(!(foundPayment.toUser.id === user.id || foundPayment.fromUser.id === user.id)) {
            return res.status(422).send({errors: [{title: "Invalid user!", detail: "You are not rental owner or booking user!"}]})
        }

        // It will charge to booking user when owner accept payment. 
        // Or, booking user accept reproposal date from rental owner.
        // This charge is not directly going to rental owner, but paid to platform owner.
        // Platform owner have to pay to rental owner manually considering commision rate.
        const booking = foundPayment.booking
        const charge = await stripe.charges.create({
            amount: booking.totalPrice,
            currency: 'jpy',
            customer: foundPayment.fromStripeCustomerId
        })

        if(charge) {
            foundPayment.charge = charge
            foundPayment.status = 'paid'
            foundPayment.paidAt = new Date()
            foundPayment.save(function(err) {
                if(err) {
                    return res.status(422).send({errors: normalizeErrors(err.errors)})
                }
                Booking.updateOne({ _id: booking}, { status: 'active'}, function(){})

                if(foundPayment.toUser.id === user.id) {
                    sendEmailTo(foundPayment.fromUser.email, REQUEST_ACCEPTED_BY_OWNER, booking, req.hostname)
                }
                if (foundPayment.fromUser.id === user.id) {
                    sendEmailTo(foundPayment.toUser.email, REQUEST_ACCEPTED_BY_USER, booking, req.hostname)
                }
                return res.json({ status: 'paid'})

                // User.updateOne({_id: foundPayment.toUser}, { $inc: {revenue: foundPayment.amount}}, function(err, user) {
                //     if(err) {
                //         return res.status(422).send({errors: normalizeErrors(err.errors)})
                //     }
                //     sendEmailTo(payment.fromUser.email, ACCEPTED)
                //     return res.json({ status: 'paid'})
                // })
            })
        }
    })
}

exports.declinePayment = function(req, res) {
    const payment = req.body
    const { booking } = req.body

    if(booking.status === 'active') {
        return res.status(422).send({errors: [{title: "Invalid request!", detail: "Cannot delete active bookings payment!"}]})
    }

    Booking.findById(booking._id) 
    .populate('rental')
    .exec(function(err, foundBooking) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }
        foundBooking.remove(function(err) {
            if (err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)})
            }
            sendEmailTo(payment.fromUser.email, REQUEST_DECLINED_BY_OWNER, foundBooking, req.hostname, payment.declineComment)
            Payment.updateOne({_id: payment._id}, {status: 'declined'}, function(){})
            Rental.updateOne({_id: foundBooking.rental._id}, {$pull: {bookings: foundBooking._id}}, ()=>{}) // Delete Booking from Rental
    
            return res.json({"status": "deleted"})
        })
    })
}
