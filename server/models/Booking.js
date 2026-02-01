const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentIntentId: { type: String, required: true }, // Stripe Payment Intent ID
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
