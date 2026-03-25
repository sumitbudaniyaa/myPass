const Payment = require("../../models/payments");
const Event = require("../../models/event");

const withdrawReq = async (req, res) => {
  try {
    const { adminid, eventid, eventname, amount, status } = req.body;

    const payment = await Payment.findOne({ adminid: adminid });
    const event = await Event.findById(eventid);

    const newWithdrawRequest = {
      eventId: eventid,
      eventName: eventname,
      amount,
      status: status,
    };

    event.totalWithdrawableAmount -= amount;

    payment.paymentRequests.push(newWithdrawRequest);

    await payment.save();
    await event.save();

    return res.status(200).json({ message: "Withdrawal request submitted." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error while submitting withdrawal request." });
  }
};

module.exports = { withdrawReq };
