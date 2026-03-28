const Brevo = require("@getbrevo/brevo");
require("dotenv").config();

const client = Brevo.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const transactionalApi = new Brevo.TransactionalEmailsApi();

const sendMail = async ({ to, subject, html, text }) => {
  const email = new Brevo.SendSmtpEmail();

  email.sender = { name: "myPass", email: process.env.EMAIL_USER };
  email.to = [{ email: to }];
  email.subject = subject;
  if (html) email.htmlContent = html;
  if (text) email.textContent = text;

  return transactionalApi.sendTransacEmail(email);
};

module.exports = { sendMail };
