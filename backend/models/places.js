const mongoose = require("mongoose");
const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  available: {
    type: Boolean,
    default: true
  },
    location: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    Image: {
        type: String,
        required: true
    },
    slot: {
        type: Number,
        required: true,
        default:20
    },
});
const Place = mongoose.model('Place', PlaceSchema);
module.exports = Place;
