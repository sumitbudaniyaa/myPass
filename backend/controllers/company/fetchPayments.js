const Payment = require("../../models/payments");

const fetchPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    return res.status(200).json(payments);
  } catch (err) {
    return res.status(500).json({ message: "Error in fetching bookings" });
  }
};

module.exports = { fetchPayments };
