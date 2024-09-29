// Import necessary modules
const Booking = require("../models/booking");
const Place = require("../models/places");
// Define a function to check for expired bookings
async function checkAndUpdateExpiryStatus() {
  try {
    // Find bookings where startSlot is in the past and checkinStatus is false
    const currentTime = new Date();
    const expiredBookings = await Booking.find({
      startSlot: { $lt: currentTime },
      expiryStatus: false,
      checkinStatus: false,
    });
    // Update expiryStatus to true for expired bookings
    for (const booking of expiredBookings) {
      booking.expiryStatus = true;
      await booking.save();
      const place = await Place.findById(booking.placeId);
      if (place) {
        place.slot += 1; // Increase slot count by 1
        await place.save();
      }
    }
  } catch (error) {
    console.error("Error checking and updating expiry status:", error);
  }
}
// Export the checkAndUpdateExpiryStatus function
module.exports = checkAndUpdateExpiryStatus;