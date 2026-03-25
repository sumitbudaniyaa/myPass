const Event = require("../../models/event");

const fetchEventDetail = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findOne({ _id: eventId });

    if (!event) {
      return res.status(404).json({ message: "Event details not found" });
    }

    return res.status(200).json({ event });
  } catch (err) {
    return res.status(500).json({ message: "Error in fetching event details" });
  }
};
module.exports = { fetchEventDetail };
