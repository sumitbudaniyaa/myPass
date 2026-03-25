const Event = require("../../models/event");
const Payment = require("../../models/payments");

const eventSettle = async (req, res) => {
  try {
    const { adminid, eventid, amount, requestId } = req.body;

    const payment = await Payment.findOne({ adminid });
    const event = await Event.findOne({ _id: eventid, by: adminid });

    if (!payment || !event) {
      return res.status(404).json({ message: "Event or Payment not found" });
    }

    const request = await payment.paymentRequests.find(
      (request) => request._id.toString() === requestId.toString()
    );

    request.status = "paid✅";

    await event.save();
    await payment.save();

    return res.status(200).json({ message: "Payment request updated" });
  } catch (err) {
    return res.status(500).json({ message: "Error while settling event" });
  }
};

module.exports = { eventSettle };
