const Admin = require("../../models/userAdmin");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Login = async (req, res) => {
  try {
    const { email } = req.body;
    const isAdmin = await Admin.findOne({ email });
    if (!isAdmin) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }
    const token = jwt.sign(
      {
        adminEmail: email,
      },
      process.env.JWT_SECRET
    );

    return res.status(201).json({ message: "User Logged In", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Error in logging you in" });
  }
};

module.exports = { Login };
