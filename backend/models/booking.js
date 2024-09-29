const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address"
    }
  },
  dob: {
    type: Date,
    // required: true
  },
  phno: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  aadhar: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: (value) => {
        const re = /^\d{12}$/;
        return value.match(re);
      },
      message: "Please enter a valid aadhar number"
    }
  },
  startSlot: {
    type: Date,
    required: true
  },
  endSlot: {
    type: Date,
    required: true
  },
  isExternal: {
    type: Boolean,
    default: false
  },
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  checkinStatus: {
    type: Boolean,
    default: false
  },
  checkoutStatus: {
    type: Boolean,
    default: false
  },
  ticketStatus: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Expired'],
    default: 'Confirmed'
  },
  expiryStatus: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
