const Payment = require("../../models/payments");

const deleteUpi = async (req, res) => {
  try {
    const { adminid } = req.body;

    const payment = await Payment.findOne({ adminid: adminid });

    payment.upi = "";

    await payment.save();

    return res.status(200).json({ message: "Upi Id deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Error in updating Upi id" });
  }
};

module.exports = { deleteUpi };
