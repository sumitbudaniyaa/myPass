const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("SMTP connection failed:", err.message);
  } else {
    console.log("SMTP mailer ready");
  }
});

const sendMail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: `myPass <${process.env.EMAIL_USER}>`,
    to,
    subject,
    ...(html && { html }),
    ...(text && { text }),
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
