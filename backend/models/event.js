const mongoose = require("mongoose");

const Event = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    tickets: [
      {
        ticketName: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        totalTickets: {
          type: Number,
          required: true,
        },
        bookedTickets: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    poster: {
      type: String,
      required: true,
    },
    posterPublic_id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    language: {
      type: String,
    },
    ageLimit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed"],
      default: "upcoming",
    },
    totalWithdrawableAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", Event);
