const User = require("../../models/user");

const fetchAccount = async (req, res) => {
  try {
    const userId = req.login.id;

    if (!userId) {
      return res.status(404).json({ message: "Please Log In" });
    }

    const user = await User.findOne({ _id: userId });

    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in fetching account details" });
  }
};

module.exports = { fetchAccount };
