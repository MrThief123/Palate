import { Router } from "express";
import passport from "passport";
import pool from "../config/database.js";

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

  async (req, res) => {

    const user = req.user;


    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE google_id = $1
      `,
      [user.googleId]
    );


    let userId;


    if (existingUser.rows.length === 0) {

      const result = await pool.query(
        `
        INSERT INTO users
        (google_id, name, email, photo)
        VALUES ($1,$2,$3,$4)
        RETURNING id
        `,
        [
          user.googleId,
          user.name,
          user.email,
          user.photo
        ]
      );

      userId = result.rows[0].id;


      res.redirect(
        `${process.env.FRONTEND_URL}/Onboarding`
      );

    } else {

      userId = existingUser.rows[0].id;


      const preferences = await pool.query(
        `
        SELECT user_id
        FROM preferences
        WHERE user_id=$1
        `,
        [userId]
      );


      if(preferences.rows.length === 0){

        res.redirect(
          `${process.env.FRONTEND_URL}/Onboarding`
        );

      } else {

        res.redirect(
          `${process.env.FRONTEND_URL}/discover`
        );

      }
    }
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