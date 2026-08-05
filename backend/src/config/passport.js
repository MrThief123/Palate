import passport from "passport";
import "dotenv/config";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// =====================================================
// CONFIGURE GOOGLE OAUTH STRATEGY
//
// This tells Passport how to authenticate users
// using Google OAuth.
//
// When passport.authenticate("google") is called,
// Passport will use this strategy.
//
// The process:
// 1. Redirect user to Google login
// 2. Google authenticates the user
// 3. Google sends profile information back
// 4. This callback creates a user object
// 5. done() tells Passport authentication succeeded
// =====================================================

passport.use(
  new GoogleStrategy(
    {
      // Google application credentials
      // Used to identify our app with Google
      clientID: process.env.GOOGLE_CLIENT_ID,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // URL where Google sends the user
      // after successful login
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      // Google user profile returned after login
      console.log("GOOGLE PROFILE:");
      console.log(profile);

      // Extract only the user information
      // that our application needs
      const user = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        photo: profile.photos?.[0]?.value,
      };

      // Pass the authenticated user to Passport
      //
      // null = no authentication error
      // user = logged-in user information
      //
      // Passport will now create a session
      return done(null, user);
    },
  ),
);

// =====================================================
// SERIALIZE USER
//
// Runs after successful login.
//
// Decides what information should be stored
// inside the user's session.
//
// The returned value is stored in:
// req.session.passport.user
//
// Currently we store the entire user object.
//
// Example:
// {
//   googleId: "...",
//   name: "Ishan",
//   email: "..."
// }
// =====================================================

passport.serializeUser((user, done) => {
  done(null, user);
});

// =====================================================
// DESERIALIZE USER
//
// Runs on every request after login.
//
// Takes the stored session data and converts it
// back into req.user.
//
// Example:
//
// Session:
// {
//   googleId:"123",
//   name:"Ishan"
// }
//
// becomes:
//
// req.user = {
//   googleId:"123",
//   name:"Ishan"
// }
// =====================================================

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Export configured Passport instance
// so it can be used in app.js and routes
export default passport;
