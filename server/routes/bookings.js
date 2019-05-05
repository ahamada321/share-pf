const express = require('express')
const router = express.Router()

const UserCtrl = require('./controllers/user')
const BookingCtrl = require('./controllers/booking')


router.get('/manage', UserCtrl.authMiddleware, BookingCtrl.getUserBookings)

router.delete('/:id', UserCtrl.authMiddleware, BookingCtrl.deleteBooking)

router.post('', UserCtrl.authMiddleware, BookingCtrl.createBooking)


module.exports = router