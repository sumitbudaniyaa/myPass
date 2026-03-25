const Payment = require("../../models/payments");

const getPaymentDetails = async (req, res) => {
  try {
    const { adminid } = req.body;

    const payment = await Payment.findOne({ adminid });

    return res.status(200).json(payment);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in fetching payment details" });
  }
};

module.exports = { getPaymentDetails };
