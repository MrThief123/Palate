import { Router } from "express";
import pool from "../config/database.js";

const router = Router();

// ============================================
// GET INTERNAL USER ID
//
// Passport gives us the Google ID.
// Our database uses users.id (UUID).
// ============================================

async function getDatabaseUserId(req) {
  if (!req.user) {
    return null;
  }

  const result = await pool.query(
    `
    SELECT id
    FROM users
    WHERE google_id = $1
    `,
    [req.user.googleId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].id;
}

// ============================================
// SAVE RECIPE INTERACTION
//
// POST /recipe-interactions
//
// Example:
// {
//   recipeId: "123",
//   recipeName: "Chicken Tikka Masala",
//   mealType: "dinner",
//   cuisine: "Indian",
//   action: "passed"
// }
// ============================================

router.post("/", async (req, res) => {
  try {
    console.log("[recipeInteractions] Request:", req.body);

    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    // Find our internal database UUID
    const userId = await getDatabaseUserId(req);

    if (!userId) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      recipeId,
      recipeName,
      mealType,
      cuisine,
      action,
    } = req.body;

    // Validate required fields
    if (!recipeName || !action) {
      return res.status(400).json({
        message: "recipeName and action are required",
      });
    }

    // Validate action
    const validActions = ["liked", "passed", "cooked"];

    if (!validActions.includes(action)) {
      return res.status(400).json({
        message: "Invalid interaction action",
      });
    }

    // Save interaction
    const result = await pool.query(
      `
      INSERT INTO recipe_interactions
      (
        user_id,
        recipe_id,
        recipe_name,
        meal_type,
        cuisine,
        action
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      RETURNING *
      `,
      [
        userId,
        recipeId || null,
        recipeName,
        mealType || null,
        cuisine || null,
        action,
      ],
    );

    console.log(
      "[recipeInteractions] Saved:",
      result.rows[0],
    );

    return res.status(201).json({
      message: "Recipe interaction saved",
      interaction: result.rows[0],
    });
  } catch (error) {
    console.error(
      "[recipeInteractions] Save error:",
      error,
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});

// ============================================
// GET USER RECIPE INTERACTIONS
//
// GET /recipe-interactions
//
// Useful for:
// - debugging
// - recommendation context
// - future analytics
// ============================================

router.get("/", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const userId = await getDatabaseUserId(req);

    if (!userId) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        recipe_id,
        recipe_name,
        meal_type,
        cuisine,
        action,
        created_at

      FROM recipe_interactions

      WHERE user_id = $1

      ORDER BY created_at DESC
      `,
      [userId],
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(
      "[recipeInteractions] Get error:",
      error,
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;