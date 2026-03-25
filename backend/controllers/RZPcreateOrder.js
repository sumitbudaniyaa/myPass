const Razorpay = require("razorpay");
require("dotenv").config();

const RZPcreateOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RZP_KEY_ID,
      key_secret: process.env.RZP_KEY_SECRET,
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: bookingId,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

module.exports = { RZPcreateOrder };
