const express = require('express')
const router = express.Router()

const UserCtrl = require('./controllers/user')
const ReviewCtrl = require('./controllers/review')


//refering to ./controllers/review.js
router.get('', UserCtrl.authMiddleware, ReviewCtrl.getReviews)

router.post('', UserCtrl.authMiddleware, ReviewCtrl.createReview)


module.exports = router