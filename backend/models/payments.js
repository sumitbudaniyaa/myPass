const mongoose = require("mongoose");

const Payments = new mongoose.Schema({
  adminid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  upi: {
    type: String,
  },
  paymentRequests: [
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
      eventName: String,
      amount: Number,
      status: {
        type: String,
        enum: ["paid✅", "pending", "rejected❌"],
        default: "pending",
      },
    },
  ],
});

module.exports = mongoose.model("Payments", Payments);
