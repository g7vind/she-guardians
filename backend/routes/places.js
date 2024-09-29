// routes/places.js
const express = require('express');
const Place = require('../models/places');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// Route to get all places
router.get('/places',checkAuth, async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get all places by staff id
router.get('/places/:staffId',checkAuth, async (req, res) => {
  try {
    const staffId = req.params.staffId;
    const place = await Place.findOne({ staff: staffId });
    if (!place) {
      return res.status(404).json({ message: 'No place assigned to this staff member' });
    }
    res.status(200).json(place);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to add a new place
// router.post('/places', async (req, res) => {
//   try {
//     const { name,staff, location, contact, Image } = req.body;
//     const newPlace = new Place({ name,staff, location, contact, Image });
//     await newPlace.save();
//     res.status(201).json(newPlace);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

module.exports = router;