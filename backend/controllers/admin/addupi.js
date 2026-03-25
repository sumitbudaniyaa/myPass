const Payment = require("../../models/payments");

const addUpi = async (req, res) => {
  try {
    const { upiid, adminid } = req.body;

    const payment = await Payment.findOne({ adminid: adminid });

    payment.upi = upiid;

    await payment.save();

    return res.status(200).json({ message: "Upi Id added" });
  } catch (err) {
    return res.status(500).json({ message: "Error in adding Upi id" });
  }
};

module.exports = { addUpi };
