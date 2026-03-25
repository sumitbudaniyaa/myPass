const Booking = require("../../models/booking");

const fetchBookings = async (req, res) => {
  try {
    const userId = req.login.id;

    if (!userId) {
      return res.status(404).json({ message: "Please Log In" });
    }

    const bookings = await Booking.find({
      userid: userId,
      payStatus: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ messafe: "Error in fetching bookings" });
  }
};

module.exports = { fetchBookings };
