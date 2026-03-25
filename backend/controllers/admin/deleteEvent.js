const Event = require("../../models/event");

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);

    await event.deleteOne();

    return res.status(200).json({
      message: "Event Deleted",
    });
  } catch (err) {
    return res.status(500).json({ message: "Error in deleting event" });
  }
};

module.exports = { deleteEvent };
