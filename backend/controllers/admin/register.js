const Admin = require("../../models/userAdmin.js");
const { formatWords } = require("../../utils/formatWords.js");
const Payment = require("../../models/payments.js");

const Register = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const formattedName = formatWords(name);

    const isAdmin = await Admin.findOne({ email });
    if (isAdmin) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const newAdmin = await new Admin({ name: formattedName, email, phone });

    await newAdmin.save();

    await Payment.create({
      adminid: newAdmin._id,
      upi: "",
      paymentRequests: [],
    });

    return res.status(201).json({ message: "User registered" });
  } catch (err) {
    return res.status(500).json({ message: "Error in registering user" });
  }
};

module.exports = { Register };
