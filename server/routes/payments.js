const express = require('express')
const router = express.Router()

const UserCtrl = require('./controllers/user')
const PaymentCtrl = require('./controllers/payment')


router.get('', UserCtrl.authMiddleware, PaymentCtrl.getPendingPayments)

router.get('/paid', UserCtrl.authMiddleware, PaymentCtrl.getPaidPayments)

router.post('/accept', UserCtrl.authMiddleware, PaymentCtrl.acceptPayment)

router.post('/decline', UserCtrl.authMiddleware, PaymentCtrl.declinePayment)


module.exports = router