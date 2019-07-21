const express = require('express')
const router = express.Router()

const UserCtrl = require('./controllers/user')
const BookingCtrl = require('./controllers/booking')


router.get('', UserCtrl.authMiddleware, BookingCtrl.getUserBookings)

router.post('', UserCtrl.authMiddleware, BookingCtrl.createBooking)

router.patch('', UserCtrl.authMiddleware, BookingCtrl.updateBooking)

router.delete('/:id', UserCtrl.authMiddleware, BookingCtrl.deleteBooking)

router.post('/block', UserCtrl.authMiddleware, BookingCtrl.createDateBlockBooking)


module.exports = router