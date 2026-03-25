const express = require("express");
const router = express.Router();

const verifyOTP = require("../middlewares/verifyOTP");
const { generateOtp } = require("../controllers/admin/generateOTP");
const { Register } = require("../controllers/admin/register");
const { Login } = require("../controllers/admin/login");
const verifyToken = require("../middlewares/verifyToken");
const { fetchAdmin } = require("../controllers/admin/fetchAdmin");

router.post("/OTP", generateOtp);
router.post("/register", verifyOTP, Register);
router.post("/login", verifyOTP, Login);
router.get("/fetchAdmin", verifyToken, fetchAdmin);

module.exports = router;
