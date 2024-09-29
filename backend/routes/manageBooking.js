const express = require('express');
const Booking = require('../models/booking');
const Place = require('../models/places');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const twilio = require('twilio');
require('dotenv').config();
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
console.log(TWILIO_ACCOUNT_SID);
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

router.put('/cancel/ticket/:id', checkAuth, async (req, res) => {
    try {
        const bookingId = req.params.id;      
        console.log(bookingId);
        const booking = await Booking.findOne({ bookingId });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        // Check if the ticket is already checked in
        if (booking.checkinStatus) {
            return res.status(400).json({ message: 'Cannot cancel ticket. Already checked in.' });
        }
        // Retrieve the place associated with the booking
        const place = await Place.findById(booking.placeId);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        // Increase available slot count by one
        place.slot += 1;
        // Update ticket status to "Cancelled"
        booking.ticketStatus = 'Cancelled';
        const phoneNumber = `+91${booking.phno }`;
        const cancelMessage = `Your ticket with booking ID ${bookingId} has been cancelled. Please contact the place for further details.`;
        client.messages.create({
            body: cancelMessage,
            from: TWILIO_PHONE_NUMBER,
            to: phoneNumber
          })
          .then(message => console.log(message.sid))
          .catch(error => console.error(error));
        // Save both the booking and the place to the database
        await Promise.all([booking.save(), place.save()]);

        return res.json({ message: 'Ticket successfully cancelled and place slot increased by one' });
    } catch (error) {
        console.error('Error cancelling ticket:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/checkin/ticket/:id', checkAuth, async (req, res) => {
        try {
            const bookingId = req.params.id;
            const booking = await Booking.findOne({bookingId});
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            const ticketStatus = booking.ticketStatus;
            if (ticketStatus === 'Cancelled' || ticketStatus === 'Expired'){
                return res.status(400).json({ message: 'Cannot check in. Ticket has been cancelled or expired.' });
            }
            if (booking.checkinStatus) {
                return res.status(400).json({ message: 'Ticket already checked in' });
            }
            booking.checkinStatus = true;
            await booking.save();
            return res.json({ message: 'Ticket successfully checked in' });
    }catch (error) {
    console.error('Error checking in ticket:', error);
    return res.status(500).json({ error: 'Internal server error' });
    }}
);
router.put('/checkout/ticket/:id', checkAuth, async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findOne({bookingId});
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        const ticketStatus = booking.ticketStatus;
        if (ticketStatus === 'Cancelled' || ticketStatus === 'Expired'){
            return res.status(400).json({ message: 'Cannot check out. Ticket has been cancelled or expired.' });
        }
        if (!booking.checkinStatus) {
            return res.status(400).json({ message: 'Ticket not checked in' });
        }
        if (booking.checkoutStatus) {
            return res.status(400).json({ message: 'Ticket already checked out' });
        }
        const place = await Place.findById(booking.placeId);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        place.slot += 1;
        booking.checkoutStatus = true;
        await booking.save();
        return res.json({ message: 'Ticket successfully checked out' });
    }
    catch (error) {
    console.error('Error checking out ticket:', error);
    return res.status(500).json({ error: 'Internal server error' });
    }
    }
);
module.exports = router;

