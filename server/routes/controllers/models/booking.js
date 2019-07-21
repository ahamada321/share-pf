const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const bookingSchema = new Schema({
    createdAt: { type: Date, default: Date.now },

    startAt: { type: Date, required: "Starting date is required" },
    endAt: { type: Date, required: "Ending date is required" },
    oldStartAt: Date,
    oldEndAt: Date,
    comment: String,
    days: Number,
    courseTime: Number,
    totalPrice: Number,
    //guests: Number,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    rental: { type: Schema.Types.ObjectId, ref: "Rental" },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    status: { type: String, default: "pending" },
    review: { type: Schema.Types.ObjectId, ref: "Review" }
});

module.exports = mongoose.model('Booking', bookingSchema);
