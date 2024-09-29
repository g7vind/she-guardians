const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const placesRouter=require('./routes/places');
const bookingRouter = require('./routes/booking');
const bookingManageRouter = require('./routes/manageBooking');
const picRouter = require('./routes/picUpload');
const cors = require('cors'); // Import the cors package
const app = express(); // Define app here
require('dotenv').config();
// const multer = require('./middleware/multer.js');
const uploadRoute = require('./routes/routeupload');
const checkAndUpdateExpiryStatus = require('./scheduler/bookingSchedule');
// console.log(process.env.DB);

const PORT = process.env.PORT ;
const DB = process.env.DB;
const FRONTEND_URL = "http://localhost:3000";
// Use the cors middleware
app.use(cors({ // Update with your frontend URL
  origin: FRONTEND_URL,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api', authRouter);
app.use('/api',placesRouter);
app.use('/api', bookingRouter);
app.use('/api', bookingManageRouter);
app.use('/api', uploadRoute);
app.use('/api', picRouter);


// MongoDB Connection
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true// Added to handle deprecation warning
})
.then(() => {
  console.log('MongoDB connected');
  // Start server after successful DB connection
})
.catch(err => {
  console.error('DB connection failed:', err);
});
setInterval(checkAndUpdateExpiryStatus, 60 * 60 * 1000);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
