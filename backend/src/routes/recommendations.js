import { Router } from "express";
import pool from "../config/database.js";

import { getMemories } from "../services/memoryService.js";
import {
  getRecipeInteractions,
} from "../services/recipeInteractionService.js";

import {
  generateRecipes,
  generateCookingRecipe,
} from "../services/aiService.js";

const router = Router();

// ============================================
// GENERATE RECOMMENDATIONS
//
// POST /recommendations
//
// Frontend sends:
//
// {
//   mealType: "dinner",
//   passedRecipes: [...]
// }
//
// Backend:
// 1. Authenticates user
// 2. Gets user UUID
// 3. Gets preferences
// 4. Gets persistent memories
// 5. Sends everything to Bedrock
// 6. Returns lightweight recipes
// ============================================

router.post("/", async (req, res) => {
  try {
    // ==========================================
    // CHECK AUTHENTICATION
    // ==========================================

    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    // ==========================================
    // GET REQUEST DATA
    // ==========================================

    const {
      mealType = "dinner",
    } = req.body;

    const validMeals = [
      "breakfast",
      "lunch",
      "dinner",
      "dessert",
    ];

    if (!validMeals.includes(mealType)) {
      return res.status(400).json({
        message: "Invalid meal type",
      });
    }

    // ==========================================
    // FIND INTERNAL USER UUID
    // ==========================================

    const userResult = await pool.query(
      `
      SELECT id
      FROM users
      WHERE google_id = $1
      `,
      [req.user.googleId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userId = userResult.rows[0].id;

    // ==========================================
    // GET USER PREFERENCES
    // ==========================================

    const preferencesResult = await pool.query(
      `
      SELECT
        diet,
        cuisines,
        allergies,
        cooking_skill,
        cooking_time
      FROM preferences
      WHERE user_id = $1
      `,
      [userId]
    );

    const row = preferencesResult.rows[0];

    const preferences = row
      ? {
          diet: row.diet,
          cuisines: row.cuisines || [],
          allergies: row.allergies || [],
          cookingSkill: row.cooking_skill,
          cookingTime: row.cooking_time,
        }
      : null;

    // ==========================================
    // GET PERSISTENT MEMORIES
    // ==========================================

    const memories = await getMemories(userId);

    const interactions = await getRecipeInteractions(userId);

    // ==========================================
    // LIMIT PASSED RECIPES
    //
    // We don't need to send hundreds of old
    // rejected recipes to Bedrock.
    // ==========================================

    console.log(
      "[Recommendations] Generating recipes:",
      {
        userId,
        mealType,
        memoryCount: memories.length,
        interactionCount: interactions.length,
      }
    );

    // ==========================================
    // GENERATE RECIPES
    // ==========================================

    const recipes = await generateRecipes({
      preferences,
      memories,
      interactions,
      mealType,
      count: 10,
    });


    // ==========================================
    // RETURN RECIPES
    // ==========================================

    res.json({
      mealType,
      recipes,
    });

  } catch (error) {
    console.error(
      "Recommendation error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to generate recommendations",
    });
  }
});

// ============================================
// SAVE COOKING FEEDBACK
//
// POST /recommendations/feedback
//
// User has cooked a recipe and provides:
// - rating
// - optional written feedback
//
// This is stored as persistent behavioural
// memory in recipe_interactions.
// ============================================

router.post("/feedback", async (req, res) => {
  try {
    // ==========================================
    // CHECK AUTHENTICATION
    // ==========================================

    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    // ==========================================
    // GET REQUEST DATA
    // ==========================================

    const {
      recipeId,
      recipeName,
      mealType,
      cuisine,
      rating,
      feedback,
    } = req.body;

    if (
      !recipeId ||
      !recipeName ||
      !rating
    ) {
      return res.status(400).json({
        message:
          "Recipe and rating are required",
      });
    }

    // ==========================================
    // VALIDATE RATING
    // ==========================================

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message:
          "Rating must be between 1 and 5",
      });
    }

    // ==========================================
    // FIND INTERNAL USER UUID
    // ==========================================

    const userResult = await pool.query(
      `
      SELECT id
      FROM users
      WHERE google_id = $1
      `,
      [req.user.googleId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userId = userResult.rows[0].id;

    // ==========================================
    // SAVE COOKED RECIPE + FEEDBACK
    // ==========================================

    const result = await pool.query(
      `
      INSERT INTO recipe_interactions
      (
        user_id,
        recipe_id,
        recipe_name,
        meal_type,
        cuisine,
        action,
        rating,
        feedback
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
      )

      RETURNING *
      `,
      [
        userId,
        recipeId,
        recipeName,
        mealType || null,
        cuisine || null,
        "cooked",
        rating,
        feedback || null,
      ]
    );

    console.log(
      "[Feedback] Saved:",
      result.rows[0]
    );

    res.status(201).json({
      message: "Feedback saved",
      interaction: result.rows[0],
    });

  } catch (error) {
    console.error(
      "[Feedback] Error:",
      error
    );

    res.status(500).json({
      message: "Failed to save feedback",
    });
  }
});

// ============================================
// GENERATE FULL COOKING RECIPE
//
// POST /recommendations/cooking
//
// Takes a lightweight recipe and generates:
// - ingredients
// - instructions
//
// This keeps the initial recommendation
// response cheap and small.
// ============================================

router.post("/cooking", async (req, res) => {
  try {
    // ==========================================
    // CHECK AUTHENTICATION
    // ==========================================

    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const { recipe } = req.body;

    if (!recipe) {
      return res.status(400).json({
        message: "Recipe is required",
      });
    }

    // ==========================================
    // FIND INTERNAL USER UUID
    // ==========================================

    const userResult = await pool.query(
      `
      SELECT id
      FROM users
      WHERE google_id = $1
      `,
      [req.user.googleId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userId = userResult.rows[0].id;

    // ==========================================
    // GET USER MEMORIES
    // ==========================================

    const memories = await getMemories(userId);

    // ==========================================
    // GET PERSISTENT RECIPE INTERACTIONS
    //
    // These are retrieved directly from
    // CockroachDB instead of relying on
    // frontend state.
    // ==========================================

    const interactions =
  await getRecipeInteractions(userId);

    // ==========================================
    // GET USER PREFERENCES
    // ==========================================

    const preferencesResult = await pool.query(
      `
      SELECT
        diet,
        cuisines,
        allergies,
        cooking_skill,
        cooking_time
      FROM preferences
      WHERE user_id = $1
      `,
      [userId]
    );

    let preferences = null;

    if (preferencesResult.rows.length > 0) {
      const row =
        preferencesResult.rows[0];

      preferences = {
        diet: row.diet,
        cuisines: row.cuisines || [],
        allergies: row.allergies || [],
        cookingSkill:
          row.cooking_skill,
        cookingTime:
          row.cooking_time,
      };
    }

    // ==========================================
    // GENERATE DETAILED RECIPE
    // ==========================================

    const detailedRecipe =
      await generateCookingRecipe({
        recipe,
        preferences,
        memories,
      });

    // ==========================================
    // RETURN DETAILED RECIPE
    // ==========================================

    res.json({
      recipe: detailedRecipe,
    });

  } catch (error) {
    console.error(
      "Cooking recipe error:",
      error
    );

    res.status(500).json({
      message: "Failed to generate recipe",
    });
  }
});

export default router;
