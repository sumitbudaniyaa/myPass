const Admin = require("../../models/userAdmin");

const fetchAdmin = async (req, res) => {
  try {
    const { adminEmail } = req.login;
    const isAdmin = await Admin.findOne({ email: adminEmail });

    if (!isAdmin) {
      return res.status(401).json({ message: "User does not exist" });
    }

    return res.status(200).json({ message: "User Logged In", isAdmin });
  } catch (err) {
    return res.status(500).json({ message: "Error in loading dashboard" });
  }
};

module.exports = { fetchAdmin };
