const Event = require("../../models/event");
const Booking = require("../../models/booking");

const fetchpaymentEvents = async (req, res) => {
  try {
    const { adminId } = req.body;

    const events = await Event.find({ by: adminId }).sort({ createdAt: -1 });

    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).json({ message: "Error in fetching events" });
  }
};

module.exports = { fetchpaymentEvents };
