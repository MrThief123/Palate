import passport from "passport";
import "dotenv/config";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      console.log("GOOGLE PROFILE:");
      console.log(profile);

      // Create user object from Google profile data
      const user = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        photo: profile.photos?.[0]?.value,
      };

      // Pass user data to Passport
      return done(null, user);
    },
  ),
);

// Store user data in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Retrieve user data from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
