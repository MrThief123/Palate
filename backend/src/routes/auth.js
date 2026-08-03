import { Router } from "express";
import passport from "passport";
import pool from "../config/database.js";

// Create an Express router for authentication-related routes
const router = Router();


// GOOGLE LOGIN START ROUTE
// This route starts the Google OAuth login process.
// When the user visits /auth/google, they are redirected
// to Google's login page.
// GOOGLE LOGIN START ROUTE
// Starts Google OAuth authentication flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
    ],
    session: true
  })
);



// GOOGLE LOGIN CALLBACK ROUTE
// Google redirects the user back to this route after
// successful authentication.
//
// Example flow:
// Frontend -> /auth/google
//           -> Google Login
//           -> /auth/google/callback
//
router.get(
  "/google/callback",

  passport.authenticate("google", {
    // If Google authentication fails, redirect user
    // back to the frontend login page
    failureRedirect: `${process.env.FRONTEND_URL}/`,
  }),


  async (req, res) => {
    // Passport attaches the authenticated Google user
    // information to req.user
    const user = req.user;

    // Check if this Google account already exists
    // in our database
    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE google_id = $1
      `,
      [user.googleId]
    );


    let userId;

    // NEW USER REGISTRATION
    
    // If no user exists with this Google ID,
    // create a new account.
    if (existingUser.rows.length === 0) {
      const result = await pool.query(
        `
        INSERT INTO users
        (google_id, name, email, photo)
        VALUES ($1,$2,$3,$4)
        RETURNING id
        `,
        [
          user.googleId, // Unique Google account ID
          user.name,     // User's Google display name
          user.email,    // User's Google email
          user.photo     // Profile picture URL
        ]
      );


      // Store the newly created user's database ID
      userId = result.rows[0].id;

      // New users need to complete onboarding
      // (diet preferences, allergies, cooking skills, etc.)
      res.redirect(
        `${process.env.FRONTEND_URL}/Onboarding`
      );
    } 
    
    
    // EXISTING USER LOGIN
    
    else {
      // Get the existing user's database ID
      userId = existingUser.rows[0].id;

      // Check whether the user has completed onboarding
      // by looking for saved preferences
      const preferences = await pool.query(
        `
        SELECT user_id
        FROM preferences
        WHERE user_id=$1
        `,
        [userId]
      );



      // If no preferences exist, the user has not
      // completed onboarding yet
      if(preferences.rows.length === 0){

        res.redirect(
          `${process.env.FRONTEND_URL}/Onboarding`
        );


      } 
      
      // If preferences exist, the user has already
      // completed setup and can access the app
      else {
        res.redirect(
          `${process.env.FRONTEND_URL}/discover`
        );

      }
    }
  }
);




// GET CURRENT USER ROUTE

// Allows the frontend to check who is currently logged in.
//
// Example:
// GET /auth/current
//
// Returns:
// {
//   name: "Ishan",
//   email: "example@gmail.com"
// }
//
// or null if nobody is logged in.
router.get(
  "/current",
  (req, res) => {
    res.json(req.user || null);
  }
);




// LOGOUT ROUTE

// Logs the user out by destroying the Passport session
// and redirects them back to the frontend home page.
router.get(
  "/logout",

  (req, res) => {
    // Remove authentication session
    req.logout(() => {});

    // Redirect user back to frontend after logout
    res.redirect(process.env.FRONTEND_URL);
  }
);


// Export router so it can be used in server.js
export default router;