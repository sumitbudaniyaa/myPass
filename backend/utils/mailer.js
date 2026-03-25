const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
