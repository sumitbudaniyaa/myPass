const Booking = require("../../models/booking");

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.payStatus === false) {
      await booking.deleteOne();
      return res
        .status(200)
        .json({ message: "Booking cancelled successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Paid bookings cannot be cancelled" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in server while cancelling booking" });
  }
};

module.exports = { cancelBooking };
