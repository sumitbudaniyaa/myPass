const User = require("../../models/user");
const Booking = require("../../models/booking");

const deleteAccount = async (req, res) => {
  try {
    const userId = req.login.id;

    if (!userId) {
      return res.status(404).json({ message: "Please Log In" });
    }

    await Booking.deleteMany({ userid: userId });
    await User.deleteOne({ _id: userId });

    return res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Error in deleting account" });
  }
};

module.exports = { deleteAccount };
