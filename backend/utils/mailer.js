const { BrevoClient } = require("@getbrevo/brevo");
require("dotenv").config();

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

const sendMail = async ({ to, subject, html, text }) => {
  return brevo.transactionalEmails.sendTransacEmail({
    sender: { name: "myPass", email: process.env.EMAIL_USER },
    to: [{ email: to }],
    subject,
    ...(html && { htmlContent: html }),
    ...(text && { textContent: text }),
  });
};

module.exports = { sendMail };
