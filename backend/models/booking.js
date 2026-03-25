const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketName: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  qrText: String,
  qrImage: String,
  checkedIn: { type: Boolean, default: false },
});

const BookingSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  eventName: {
    type: String,
    require: true,
  },
  eventPoster: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  totalTickets: {
    type: Number,
    required: true,
  },
  payStatus: {
    type: Boolean,
    required: true,
  },
  tickets: [ticketSchema],
});

module.exports = mongoose.model("Booking", BookingSchema);
