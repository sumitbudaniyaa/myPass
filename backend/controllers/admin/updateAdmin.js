const Admin = require("../../models/userAdmin");

const updateAdmin = async (req, res) => {
  try {
    const { adminid, name, email, phone } = req.body;

    const admin = await Admin.findById(adminid);

    admin.name = name;
    admin.email = email;
    admin.phone = phone;

    await admin.save();

    return res.status(200).json({ message: "Admin details updated" });
  } catch (err) {
    return res.status(500).json({ message: "Error in updating details" });
  }
};

module.exports = { updateAdmin };
