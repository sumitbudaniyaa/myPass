const redis = require("../utils/redisClient");

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp || storedOtp !== otp.toString()) {
      return res.status(401).json({ message: "Invalid or Missing Otp" });
    }

    await redis.del(`otp:${email}`);

    next();
  } catch (err) {
    return res.status(500).json({ message: "Error in OTP verification" });
  }
};

module.exports = verifyOTP;
