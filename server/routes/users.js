const express = require('express')
const router = express.Router()

const UserCtrl = require('./controllers/user')

//refering to ./controllers/user.js
router.post('/auth', UserCtrl.auth )

router.post('/fb-auth', UserCtrl.FBauth )

router.post('/reset', UserCtrl.sendPasswordResetLink )

router.patch('/reset/:token', UserCtrl.setNwePassword )

router.post('/register', UserCtrl.register )

router.get('/register/:token', UserCtrl.emailVerification )

router.get('/:id', UserCtrl.authMiddleware, UserCtrl.getUser)

router.patch('/:id', UserCtrl.authMiddleware, UserCtrl.updateUser)

//router.post('/resend', UserCtrl.resendTokenPost )

module.exports = router