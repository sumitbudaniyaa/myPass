const Booking = require("../../models/booking");

const fetchBookings = async (req, res) => {
  try {
    const Bookings = await Booking.find().sort({ createdAt: -1 });

    return res.status(200).json(Bookings);
  } catch (err) {
    return res.status(500).json({ message: "Error in fetching bookings" });
  }
};

module.exports = { fetchBookings };
