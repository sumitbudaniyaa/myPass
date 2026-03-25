const Event = require("../../models/event");

const fetchEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).json({ message: "Error in fetching events" });
  }
};

module.exports = { fetchEvents };
