import { Router } from "express";
import pool from "../config/database.js";

// Create router for preference-related endpoints
const router = Router();


// ============================================
// SAVE USER PREFERENCES
// POST /preferences
//
// This route receives the onboarding form data
// and stores it in the preferences table.
//
// Flow:
// Frontend onboarding form
//        ↓
// POST /preferences
//        ↓
// Find logged-in user
//        ↓
// Insert/update preferences in database
// ============================================

router.post("/", async (req, res) => {

  try {
    // Debug: View data sent from frontend
    console.log("REQUEST BODY:");
    console.log(req.body);

    // Debug: View currently authenticated user
    // Passport stores the logged-in user here
    console.log("LOGGED USER:");
    console.log(req.user);

    // Check whether the user is logged in
    // If Google authentication failed or the session expired,
    // req.user will be undefined.
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated"
      });

    }

    // Find the user's UUID from our database
    //
    // Passport gives us the Google user ID,
    // but our preferences table needs our internal users.id.
    //
    // Example:
    // Google ID -> 114145641504119484896
    // users.id -> UUID
    //
    const userResult = await pool.query(

      `
      SELECT id
      FROM users
      WHERE google_id = $1
      `,

      [
        req.user.googleId
      ]

    );


    // If the Google account exists in Passport
    // but not in our database, return an error.
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message:"User not found"
      });
    }

    // Store our database user UUID
    const userId = userResult.rows[0].id;

    // Extract onboarding information sent
    // from the React frontend.
    const {
      diet, cuisines, allergies, cookingSkill, cookingTime
    } = req.body;


    // Insert user preferences into database.
    //
    // ON CONFLICT(user_id):
    // If this user already has preferences,
    // update the existing row instead of creating
    // duplicate preferences.
    //
    // This allows users to change their preferences
    // later from a settings page.
    await pool.query(

      `
      INSERT INTO preferences

      (
        user_id,
        diet,
        cuisines,
        allergies,
        cooking_skill,
        cooking_time
      )


      VALUES

      ($1,$2,$3,$4,$5,$6)



      ON CONFLICT(user_id)

      DO UPDATE SET

        diet = EXCLUDED.diet,

        cuisines = EXCLUDED.cuisines,

        allergies = EXCLUDED.allergies,

        cooking_skill = EXCLUDED.cooking_skill,

        cooking_time = EXCLUDED.cooking_time

      `,


      [
        // User this preference belongs to
        userId,

        // Convert empty diet selection
        // from "" to database NULL
        diet || null,
        cuisines, // Array of selected cuisines
        allergies, // Array of allergies
        cookingSkill, // Beginner/intermediate/advanced
        cookingTime // Maximum cooking time in minutes
      ]

    );

    console.log(
      "Preferences saved successfully"
    );

    // Send successful response back
    // to the React frontend.
    res.status(201).json({
      message:"Preferences saved"
    });
  }


  catch(error){
    // Log unexpected database/server errors
    console.error(
      "Preference save error:",
      error
    );

    res.status(500).json({
      message:"Server error"
    });
  }
});

// Export router so it can be used in app.js
export default router;