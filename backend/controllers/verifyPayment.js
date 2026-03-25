const crypto = require("crypto");
const Booking = require("../models/booking");
const Event = require("../models/event");
const { sendMail } = require("../utils/mailer");
const path = require("path");
const { fork } = require("child_process");

const formatTo12Hour = (timeStr) => {
  if (!timeStr) return;
  const [hourStr, minuteStr] = timeStr?.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  const formattedMinute = minute < 10 ? "0" + minute : minute;
  return `${formattedHour}:${formattedMinute} ${ampm}`;
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      eventId,
      userEmail,
      userName,
      userPhone,
    } = req.body;

    const generateSignature = crypto
      .createHmac("sha256", process.env.RZP_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generateSignature !== razorpay_signature) {
      return res.status(404).json({ message: "Invalid Signature" });
    }

    const booking = await Booking.findById(bookingId);
    const event = await Event.findById(eventId);

    const qrWorkerPath = path.join(__dirname, "..", "workers", "qrWorker.js");
    const qrProcess = fork(qrWorkerPath);

    qrProcess.send({ tickets: booking.tickets, bookingId });

    qrProcess.on("message", async (message) => {
      if (message.error) {
        console.error("❌ QR error:", message.error);
        return res.status(500).json({ message: "QR Generation Failed" });
      }

      booking.tickets = message.tickets;
      event.totalWithdrawableAmount += booking.totalPrice;
      booking.payStatus = true;
      booking.phone = userPhone;

      booking.tickets.forEach((ticket) => {
        const eventTicket = event.tickets.find(
          (t) => t.ticketName === ticket.ticketName
        );
        if (eventTicket) eventTicket.bookedTickets += 1;
      });

      await Promise.all([booking.save(), event.save()]);

      res.status(200).json({ message: "Booking Confirmed", booking });

      setImmediate(() => {
        try {
          sendMail({
            to: userEmail,
            subject: `🎟️ Ticket Confirmation - ${event.name}`,
            html: ` <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 700px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <h2 style="color: #2d89ef; text-align: center; font-size: 30px">🎉 Booking Confirmed!</h2>
        <p style="font-size: 16px; color: #333;">Hi ${userName || "User"},</p>
        <p style="font-size: 16px; color: #333;">Thank you for booking with <strong>myPass</strong></p>
        
        <hr style="margin: 20px 0;" />

        <div style="font-size: 16px; color: #555;">
          <p><strong>Event:</strong> ${event.name}</p>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          )}</p>
          <p><strong>Time:</strong> ${formatTo12Hour(event.time)}</p>
          <p><strong>Venue:</strong> ${event.venue}</p>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
        </div>

        <div style="margin-top: 20px;">
          <h3 style="color: #2d89ef;">🎫 Tickets</h3>
          <ul style="list-style: none; padding: 0;">
            ${booking?.tickets
              ?.map(
                (ticket) => `
                <li style="margin: 10px 0; padding: 10px; background: #f0f8ff; border-radius: 6px;">
                  <strong>${ticket?.ticketName}</strong> - ₹${ticket?.ticketPrice}
                </li>
              `
              )
              .join("")}
          </ul>
        </div>

        <p style="font-size: 18px; font-weight: bold; color: #333; margin-top: 20px;">
          Total Paid: ₹${booking?.totalPrice}
        </p>

        <hr style="margin: 30px 0;" />
         
        <p style="font-size: 14px; color: #777; text-align: center;">
                You can find your QR ticket(s) in the myPass app.
              </p>

        <p style="font-size: 14px; color: #aaa; text-align: center; margin-top: 20px;">
          &copy; ${new Date().getFullYear()} myPass. All rights reserved.
        </p>

      </div>
    </div>`,
          });
        } catch (err) {
          console.error("❌ Failed to send email:", err.message);
        }
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { verifyPayment };
