const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    time: { type: String, required: true }, // Format: HH:MM
    isBooked: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);
