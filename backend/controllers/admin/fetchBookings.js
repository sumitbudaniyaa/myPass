const Booking = require("../../models/booking");

const fetchBookings = async (req, res) => {
  try {
    const { eventId } = req.body;

    const bookings = await Booking.find({ eventid: eventId, payStatus: true })
      .populate("userid")
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ messafe: "Error in fetching bookings" });
  }
};

module.exports = { fetchBookings };
