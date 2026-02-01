const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const verifyToken = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
router.post('/create-payment-intent', verifyToken, async (req, res) => {
    try {
        const { slotId } = req.body;
        const slot = await Slot.findById(slotId);

        if (!slot || slot.isBooked) {
            return res.status(400).json({ message: 'Slot unavailable' });
        }

        // Hardcoded price for demo, e.g., $10.00
        const amount = 1000;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: { slotId, userId: req.user.userId }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Payment init failed' });
    }
});

// Finalize Booking (after payment success)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { slotId, paymentIntentId } = req.body;

        const slot = await Slot.findById(slotId);
        if (!slot || slot.isBooked) {
            return res.status(400).json({ message: 'Slot unavailable' });
        }

        // Create booking
        const booking = new Booking({
            slotId,
            visitorId: req.user.userId,
            hostId: slot.hostId,
            paymentIntentId
        });

        await booking.save();

        // Mark slot as booked
        slot.isBooked = true;
        await slot.save();

        // Emit event for real-time update (Phase 5) - Placeholder
        const io = req.app.get('io');
        if (io) {
            io.emit('slot-update', { slotId, action: 'booked' });
        }

        res.status(201).json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Booking failed' });
    }
});

// Get My Bookings (Visitor)
router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ visitorId: req.user.userId })
            .populate({
                path: 'slotId',
                select: 'date time'
            })
            .populate('hostId', 'name email');

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
