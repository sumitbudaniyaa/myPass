const Booking = require("../../models/booking");
const { sendMail } = require("../../utils/mailer");

const personalMail = async (req, res) => {
  try {
    const { eventid, subject, body } = req.body;

    const bookings = await Booking.find({
      eventid: eventid,
      payStatus: true,
    }).populate("userid");

    for (let booking of bookings) {
      const email = booking?.userid?.email;
      const name = booking?.userid?.name;

      await sendMail({
        to: email,
        subject: subject,
        html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 800px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <p style="font-size: 16px; color: #333;">Hi ${name || "User"},</p>
        <p style="font-size: 16px; color: #333;">${body}</p>
        
        <p style="font-size: 14px; color: #aaa; text-align: center; margin-top: 20px;">
          &copy; ${new Date().getFullYear()} myPass. All rights reserved.
        </p>
      </div>
    </div>`,
      });
    }

    return res.status(200).json({ message: "Mail sent!" });
  } catch (err) {
    return res.status(500).json({ message: "Error in fetching user details" });
  }
};

module.exports = { personalMail };
