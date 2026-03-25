const Event = require("../../models/event");

const fetchEvent = async (req, res) => {
  try {
    const events = await Event.find({ status: "upcoming" }).sort({
      createdAt: -1,
    });

    if (events.length === 0) {
      return res.status(200).json({ message: "No events found" });
    }
    return res.status(200).json({ events });
  } catch (err) {
    return res.status(500).json({ message: "Server error in fetching events" });
  }
};

module.exports = { fetchEvent };
