import { Router } from "express";
import passport from "passport";

const router = Router();


// Start Google OAuth login flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
    ],
  })
);


// Google OAuth callback route
router.get(
  "/google/callback",

  passport.authenticate("google", {
    // Redirect here if authentication fails
    failureRedirect: `${process.env.FRONTEND_URL}/`,
  }),

  (req, res) => {
    console.log("LOGGED IN USER:");
    console.log(req.user);

    // Redirect user to frontend after successful login
    res.redirect(`${process.env.FRONTEND_URL}/onboarding`);
  }
);


// Get currently authenticated user
router.get(
  "/current",
  (req, res) => {
    res.json(req.user || null);
  }
);


// Logout current user
router.get(
  "/logout",
  (req, res) => {
    req.logout(() => {});

    // Redirect back to frontend after logout
    res.redirect(process.env.FRONTEND_URL);
  }
);


export default router;