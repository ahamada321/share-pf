const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    FBuserID: String,
    
    username: {
        type: String,
        max: [32, 'Too long, max is 32 characters.'],
        min: [4, 'Too short, min is 4 characters.'],
    },
    email: {
        type: String,
        max: [32, 'Too long, max is 32 characters.'],
        min: [4, 'Too short, min is 4 characters.'],
        unique: true,
        lowercase: true,
        required: 'Email is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        max: [32, 'Too long, max is 32 characters.'],
        min: [4, 'Too short, min is 4 characters.'],
        required: 'Password is required',
    },
    customer: {
        id: { type: String, default: '' },
        default_source: { type: String, default: '' }
    },
    rating: Number,
    description: String,

    isVerified: { type: Boolean, default: false },
    userRole:  { type: String, default: "User" }, // User, Owner, OEM_Owner
    
    rentals: [{ type: Schema.Types.ObjectId, ref: "Rental" }],
    // favouriteRentals: [{ type: Schema.Types.ObjectId, ref: "Rental" }],
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }]
})

userSchema.methods.hasSamePassword = function(requestPassword) {
    return bcrypt.compareSync(requestPassword, this.password)
}

userSchema.pre('save', function(next) {
    const user = this

    // Skip if user didn't update user password
    if(user.password){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                user.password = hash
                next()
            });
        });
    } else {
        next()
    }
})

module.exports = mongoose.model('User', userSchema)
