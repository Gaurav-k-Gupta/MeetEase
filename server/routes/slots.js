const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');
const verifyToken = require('../middleware/auth');

// Create Slot (Host only)
router.post('/', verifyToken, async (req, res) => {
    if (req.user.role !== 'host') return res.status(403).json({ message: 'Access denied' });

    try {
        const { date, time } = req.body;
        const slot = new Slot({
            hostId: req.user.userId,
            date,
            time
        });
        await slot.save();
        res.status(201).json(slot);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Slots (For Host to see their own, or Visitor to see all available)
// Query params: hostId (optional)
router.get('/', async (req, res) => {
    try {
        const { hostId } = req.query;
        let query = {};

        if (hostId) {
            query.hostId = hostId;
        } else {
            // Visitors only see available slots
            query.isBooked = false;
        }

        const slots = await Slot.find(query).populate('hostId', 'name email');
        res.json(slots);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Slot (Host only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });

        if (slot.hostId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (slot.isBooked) {
            return res.status(400).json({ message: 'Cannot delete booked slot' });
        }

        await slot.deleteOne();

        // Emit event for real-time update
        const io = req.app.get('io');
        if (io) {
            io.emit('slot-update', { slotId: req.params.id, action: 'deleted' });
        }

        res.json({ message: 'Slot deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
