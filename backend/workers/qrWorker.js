const QRCode = require("qrcode");

process.on("message", async ({ tickets, bookingId }) => {
  try {
    const updatedTickets = await Promise.all(
      tickets.map(async (ticket, index) => {
        const qrText = `${bookingId}-${index}-${ticket.ticketName}`;
        const qrImage = await QRCode.toDataURL(qrText);
        return { ...ticket, qrText, qrImage };
      })
    );

    process.send({ tickets: updatedTickets });
  } catch (err) {
    process.send({ error: err.message });
  }
});
