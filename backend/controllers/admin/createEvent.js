const Event = require("../../models/event");
const { formatWords } = require("../../utils/formatWords");
const cloudinary = require("../../config/cloudinary");

const createEvent = async (req, res) => {
  try {
    const { preparedForm } = req.body;

    const formattedName = formatWords(preparedForm.name);

    const uploadPoster = await cloudinary.uploader.upload(preparedForm.poster, {
      folder: "poster",
    });

    preparedForm.poster = uploadPoster.secure_url;
    preparedForm.posterPublic_id = uploadPoster.public_id;

    const newEvent = await new Event({ ...preparedForm, name: formattedName });

    await newEvent.save();

    return res.status(200).json({ message: "Event Created" });
  } catch (err) {
    return res.status(500).json({ message: "Error in creating Event" });
  }
};

module.exports = { createEvent };
