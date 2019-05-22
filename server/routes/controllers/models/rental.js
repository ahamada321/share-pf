const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const rentalSchema = new Schema({
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    rating: Number,

    category: String,
    rentalname: { type: String, required: true, max: [128, 'Too long, max is 128 characters.']},
    age: Number,
    height: Number,
    bust: { type: String, required: true },
    weight: { type: String, required: true },
    image: { type: String, required: true },
    image2: { type: String, required: true },
    gallery: { type: String, required: true },
    gallery2: { type: String, required: true },
    gallery3: { type: String, required: true },
    gallery4: { type: String, required: true },
    gallery5: { type: String, required: true },
    video: { type: String },
    province: {type: String, required: true, lowercase: true },
    nearStation: {type: String, required: true, lowercase: true },
    hourlyPrice: Number,
    description: { type: String, required: true, lowercase: true },
    headlinedescription1: { type: String, required: true, lowercase: true },
    headlinedescription2: { type: String, required: true, lowercase: true },

    shared: Boolean,

    user: { type: Schema.Types.ObjectId, ref: 'User' },
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking"}]
    
});

module.exports = mongoose.model('Rental', rentalSchema);
