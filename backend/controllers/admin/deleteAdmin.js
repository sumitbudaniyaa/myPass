const Admin = require("../../models/userAdmin");
const Event = require("../../models/event");
const Payment = require("../../models/payments");

const deleteAdmin = async (req, res) => {
  try {
    const { adminid } = req.body;

    await Event.deleteMany({ by: adminid });
    await Admin.deleteOne({ _id: adminid });
    await Payment.deleteOne({ adminid: adminid });

    return res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Error in deleting account" });
  }
};

module.exports = { deleteAdmin };
