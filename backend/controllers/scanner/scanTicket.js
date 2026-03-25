const Booking = require("../../models/booking");

const scanTicket = async (req, res) => {
  try {
    const { qrText } = req.body;

    if (!qrText) return res.status(400).json({ message: "No QR data" });

    const [bookingId, ticketIndexStr, ticketName] = qrText.split("-");
    const ticketIndex = parseInt(ticketIndexStr);

    if (!bookingId || isNaN(ticketIndex)) {
      return res.status(400).json({ message: "Invalid QR format" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.payStatus) {
      return res.status(403).json({ message: "Payment not verified" });
    }

    const ticket = booking.tickets[ticketIndex];

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.checkedIn) {
      return res.status(409).json({ message: "Ticket already used" });
    }

    // ✅ Mark as used
    ticket.checkedIn = true;
    await booking.save();

    return res.status(200).json({ message: "Ticket verified & checked-in" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { scanTicket };
