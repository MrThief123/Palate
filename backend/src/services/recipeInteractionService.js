import pool from "../config/database.js";

// ============================================
// GET USER RECIPE INTERACTIONS
//
// Retrieves persistent recipe behaviour from
// CockroachDB.
//
// This replaces the old frontend-only
// passedRecipes state.
// ============================================

export async function getRecipeInteractions(
  userId,
  limit = 30
) {
  console.log(
    "[getRecipeInteractions] Fetching:",
    userId
  );

  try {
    const result = await pool.query(
      `
      SELECT
        recipe_id,
        recipe_name,
        meal_type,
        cuisine,
        action,
        created_at
      FROM recipe_interactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
      `,
      [userId, limit]
    );

    console.log(
      "[getRecipeInteractions] Count:",
      result.rows.length
    );

    return result.rows;
  } catch (error) {
    console.error(
      "[getRecipeInteractions] Error:",
      error
    );

    throw error;
  }
}