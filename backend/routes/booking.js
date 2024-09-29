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
// Route to book a slot in a place for a specific period

router.post('/bookings', checkAuth, async (req, res) => {
  try {
    const { placeId, name, email, dob, phno, address, aadhar, startSlot, endSlot, isExternal } = req.body;
    const userId = req.userData.userId;
    const place = await Place.findById(placeId);
    
    // Check if the place exists and has available slots
    if (!place || place.slot === 0) {
      return res.status(400).json({ message: 'No available slots for this place.' });
    }
    const startDate = new Date(startSlot);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(endSlot);
    endDate.setHours(0, 0, 0, 0);

    if (endDate < startDate) {
      return res.status(400).json({ message: 'End date cannot be before start date.' });
    }

    const dobDate = new Date(dob);
    dobDate.setHours(0, 0, 0, 0);
    // Check if the Aadhar number is already registered for the specified date range
    const existingBookingWithAadhar = await Booking.findOne({
      aadhar,
      startSlot: { $lte: endSlot },
      endSlot: { $gte: startSlot }
    });
    console.log(endSlot);
    if (existingBookingWithAadhar) {
      return res.status(400).json({ message: 'A slot has already been booked with this Aadhar number for the specified date range.' });
    }

    const { nanoid } = await import('nanoid');
    const uniqueId = nanoid(6);
    const newBooking = new Booking({
      userId,
      placeId,
      bookingId: uniqueId,
      name,
      email,
      dob: dobDate,
      phno,
      aadhar,
      address,
      startSlot: startDate,
      endSlot: endDate,
      isExternal,
    });

    await newBooking.save();

    const phoneNumber = `+91${phno}`;
    const confirmationMessage = `Your booking has been confirmed. Your booking ID is: ${uniqueId}`;

    client.messages.create({
      body: confirmationMessage,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error(error));

    // Decrement available slots for the place
    place.slot -= 1;
    await place.save();

    // Send response with the newly created booking
    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});


router.get('/staff/place',checkAuth,async(req,res)=>{
    try{
        const userId=req.userData.userId;
        const place=await Place.findOne({staff:userId}); 
        if(!place){
            return res.status(404).json({message:'No place assigned to this staff member'});
        }
        res.status(200).json(place);
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    } 
});

// Route to get bookings of a user
router.get('/bookings/user',checkAuth, async (req, res) => {
    try {
        const userId = req.userData.userId;
        console.log(userId);
        const userBookings = await Booking.find({ userId }).populate('placeId');
        // console.log(userBookings);
        res.status(200).json(userBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get bookings of a staff member (place)
// Route to get bookings of a place assigned to a staff member
router.get('/bookings/place/:staffId',checkAuth, async (req, res) => {
    try {
        const staffId = req.params.staffId;
        const place = await Place.findOne({ staff: staffId });
        if (!place) {
            return res.status(404).json({ message: 'No place assigned to this staff member' });
        }

        const placeBookings = await Booking.find({ placeId: place._id })
        // console.log(placeBookings)
        res.status(200).json(placeBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get places assigned to a staff member
router.get('/places/staff/:staffId',checkAuth, async (req, res) => {
    try {
        const staffId = req.params.staffId;
        const assignedPlaces = await Place.find({ staff: staffId });
        res.status(200).json(assignedPlaces);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/search/:id',checkAuth, async (req, res) => {
  try {
    const bookingId = req.params.id;
    // Check if bookingId is provided
    if (!bookingId) {
        return res.status(400).json({ success: false, message: 'BookingId parameter is required' });
    }
    const booking = await Booking.findOne({ bookingId });

    if (booking) {
      // If a booking was found, return it to the client
      res.status(200).json({ success: true, booking});
    } else {
      // If no booking was found, return an appropriate message to the client
      res.status(404).json({ success: false, message: 'Booking not found' });
    }
  } catch (error) {
    // If an error occurs during the search, return an error response to the client
    console.error('Error searching for booking:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


module.exports = router;