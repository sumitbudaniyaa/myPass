const Booking = require("../../models/booking");

const createBooking = async (req, res) => {
  try {
    const userid = await req?.login?.id;

    const {
      eventid,
      eventName,
      eventPoster,
      totalPrice,
      totalTickets,
      tickets,
      payStatus,
    } = req.body;

    const newBooking = new Booking({
      userid,
      eventid,
      eventName,
      eventPoster,
      totalPrice,
      totalTickets,
      tickets,
      payStatus,
    });

    await newBooking.save();

    return res.status(200).json(newBooking);
  } catch (err) {
    return res.status(500).json({ message: "Error in booking" });
  }
};

module.exports = { createBooking };
