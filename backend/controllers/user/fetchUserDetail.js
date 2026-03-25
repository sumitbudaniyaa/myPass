const User = require("../../models/user");

const fetchUserDetail = async (req, res) => {
  try {
    const userid = req.login.id;

    const user = await User.findById(userid);

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in fetching user details." });
  }
};

module.exports = { fetchUserDetail };
