const OtpGenerator = require("../../utils/otpGenerator.js");
const redis = require("../../utils/redisClient");
const { sendMail } = require("../../utils/mailer.js");
const Admin = require("../../models/userAdmin.js");

const generateOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = OtpGenerator();

    await redis.set(`otp:${email}`, otp, { EX: 300 });

    await sendMail({
      to: email,
      subject: "OTP",
      html: `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 400px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">Your OTP for myPass</h2>
      <p style="font-size: 24px; font-weight: bold; color: #2d89ef; margin: 20px 0;">${otp}</p>
      <p style="font-size: 14px; color: #777;">This OTP is valid for the next 5 minutes. Do not share it with anyone.</p>
    </div>`,
    });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP mail error:", err);
    return res.status(500).json({ message: "Error in sending OTP" });
  }
};

module.exports = { generateOtp };
