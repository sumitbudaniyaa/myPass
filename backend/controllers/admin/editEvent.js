const Event = require("../../models/event");
const cloudinary = require("../../config/cloudinary");

const editEvent = async (req, res) => {
  try {
    const { eventId, form } = req.body;

    const event = await Event.findById(eventId);

    event.name = form.name;
    event.venue = form.venue;
    event.city = form.city;
    event.state = form.state;
    event.date = form.date;
    event.time = form.time;
    event.description = form.description;
    event.category = form.category;
    event.ageLimit = form.ageLimit;
    event.tickets = form.tickets;
    event.status = form.status;

    if (event.poster !== form.poster) {
      await cloudinary.uploader.destroy(event.posterPublic_id);

      const result = await cloudinary.uploader.upload(form.poster, {
        folder: "poster",
      });

      (event.poster = result.secure_url),
        (event.posterPublic_id = result.public_id);
    }

    await event.save();

    return res.status(200).json({ message: "Event details updated" });
  } catch (err) {
    return res.status(500).json({ message: "Error in updating the event." });
  }
};

module.exports = { editEvent };
