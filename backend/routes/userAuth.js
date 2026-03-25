const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../config/passport");

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.redirect(`${process.env.FRONTEND_URL}/auth/?token=${token}`);
  }
);

module.exports = router;
