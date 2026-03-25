const Event = require("../../models/event");
const Admin = require("../../models/userAdmin");

const fetchEvents = async (req, res) => {
  try {
    const { adminEmail } = req.login;
    const admin = await Admin.findOne({ email: adminEmail });

    const events = await Event.find({ by: admin?._id }).sort({ createdAt: -1 });

    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).json({ message: "Error in fetching Events" });
  }
};

module.exports = { fetchEvents };
