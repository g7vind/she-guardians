const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
//const cloudinary = require('cloudinary').v2;
require('dotenv').config();
//const upload = require("../middleware/multer");
const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');
const Booking = require('../models/booking');

// cloudinary.config({
//     cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
//   });
// router.post('/upload', upload.single('image'), function (req, res) {
//   cloudinary.uploader.upload(req.file.path, function (err, result){
//     if(err) {
//       console.log(err);
//       return res.status(500).json({
//         success: false,
//         message: "Error"
//       })
//     }
//     res.status(200).json({
//       success: true,
//       message:"Uploaded!",
//       data: result
//     })
//   })
// });

router.post('/create/staff', checkAuth, async (req, res) => {
  try {
    const { name, email,password} = req.body;
    const userType = "staff";
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword , userType});
    const userdetails = await newUser.save();
    // Only return userId and userType
    res.status(201).json({ message: 'User created successfully', userType: userdetails.userType });
  } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
  }
)
router.delete('/delete/staff/:id', checkAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
);
router.get('/viewfullbooking', checkAuth, async (req, res) => {
  try {
    const booking = await Booking.find();
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
);
router.get('/viewfulluser', checkAuth, async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
);
module.exports = router;