const express = require('express')
const mongoose = require('mongoose')
const compression = require('compression')
const bodyParser = require('body-parser')
const path = require('path')
const config = require('./config')
const FakeDb = require('./fake-db')

const rentalRoutes = require('./routes/rentals')
const userRoutes = require('./routes/users')
const bookingRoutes = require('./routes/bookings')
const paymentRoutes = require('./routes/payments')
const reviewRoutes = require('./routes/reviews')
const contactformRoutes = require('./routes/contactforms')
const imageUploadRoutes = require('./routes/image-upload')

mongoose.connect(
    config.DB_URI, 
    { 
        useCreateIndex: true,
        useNewUrlParser: true 
    }).then(
    () => {
        if(process.env.NODE_ENV !== 'production') {
            const fakeDb = new FakeDb()
            // fakeDb.seeDb()
        }
    }
);

const app = express()
app.use(compression()) // compress middleware
app.use(bodyParser.json())

app.use('/api/v1/rentals', rentalRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/bookings', bookingRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/contactforms', contactformRoutes)
app.use('/api/v1', imageUploadRoutes)


if(process.env.NODE_ENV === 'production') {
    const appPath = path.join(__dirname, '..', 'dist', 'share-pf')
    const https_redirect = function () {
        return function(req, res, next) {
            if(req.headers['x-forwarded-proto'] != 'https') {
                return res.redirect('https://' + req.headers.host + req.url);
            } else {
                return next()
            }
        }
    }
    app.use(https_redirect())
    app.use(express.static(appPath))
    app.set('view cache', true) // Enable cache for user
    app.get('*', function(req, res) {
        res.sendFile(path.resolve(appPath, 'index.html'))
    })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, function() {
    console.log('I am running')
});