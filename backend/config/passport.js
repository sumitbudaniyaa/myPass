const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:`${process.env.BACKEND_URL}/api/userAuth/auth/google/callback`

    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails } = profile;
      let user = await User.findOne({ googleId: id });

      if (!user) {
        user = await User.create({
          googleId: id,
          name: displayName,
          email: emails[0].value,
        });
      }

      return done(null, user);
    }
  )
);
