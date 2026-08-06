import pool from "../config/database.js";

// ============================================
// SAVE UNIQUE MEMORY
//
// Stores a piece of user knowledge.
//
// Example:
// User likes Japanese food.
//
// Before inserting:
// - Checks if the same memory already exists
// - If yes: updates the existing memory
// - If no: creates a new memory
//
// This prevents duplicate memories
// building up from repeated onboarding.
// ============================================

export async function saveMemory(
  userId,
  type,
  content,
  metadata = {},
  importance = 5,
) {
  // Debug: See what data enters this function
  console.log("[saveMemory] Starting:", {
    userId,
    type,
    content,
    metadata,
    importance,
  });

  try {
    // ============================================
    // CHECK FOR EXISTING MEMORY
    //
    // Looks for an identical memory belonging
    // to the same user.
    //
    // Duplicate rules:
    // Same user_id
    // Same type
    // Same content
    // ============================================

    console.log("[saveMemory] Checking duplicate...");

    const existingMemory = await pool.query(
      `
      SELECT id
      FROM memories

      WHERE user_id = $1
      AND type = $2
      AND content = $3

      ORDER BY created_at DESC

      LIMIT 1
      `,
      [userId, type, content],
    );

    console.log("[saveMemory] Duplicate result:", {
      found: existingMemory.rows.length > 0,
      id: existingMemory.rows[0]?.id,
    });

    // ============================================
    // UPDATE EXISTING MEMORY
    //
    // Instead of creating another copy:
    // - Update metadata
    // - Update importance score
    // - Refresh last_accessed timestamp
    // ============================================

    if (existingMemory.rows.length > 0) {
      console.log("[saveMemory] Updating existing memory");

      const updated = await pool.query(
        `
        UPDATE memories

        SET
          metadata = $1,
          importance = $2,
          last_accessed = NOW()

        WHERE id = $3

        RETURNING *
        `,
        [metadata, importance, existingMemory.rows[0].id],
      );

      console.log("[saveMemory] Updated memory:", updated.rows[0]);

      return updated.rows[0];
    }

    // ============================================
    // CREATE NEW MEMORY
    //
    // Runs only when no duplicate exists.
    // ============================================

    console.log("[saveMemory] Creating new memory");

    const result = await pool.query(
      `
      INSERT INTO memories
      (
        user_id,
        type,
        content,
        metadata,
        importance
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )

      RETURNING *
      `,
      [userId, type, content, metadata, importance],
    );

    console.log("[saveMemory] Created memory:", result.rows[0]);

    return result.rows[0];
  } catch (error) {
    // Debug: Database or query failure
    console.error("[saveMemory] Error:", error);

    // Show failed data to make debugging easier
    console.error("[saveMemory] Failed input:", {
      userId,
      type,
      content,
      metadata,
      importance,
    });

    throw error;
  }
}

// ============================================
// GET USER MEMORIES
//
// Returns all memories belonging
// to a specific user.
//
// Later this can become:
// - vector similarity search
// - importance ranking
// - recency ranking
// ============================================

export async function getMemories(userId) {
  console.log("[getMemories] Fetching:", userId);

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM memories

      WHERE user_id = $1

      ORDER BY created_at DESC
      `,
      [userId],
    );

    console.log("[getMemories] Count:", result.rows.length);

    return result.rows;
  } catch (error) {
    console.error("[getMemories] Error:", error);

    throw error;
  }
}

// ============================================
// DELETE MEMORY
//
// Permanently removes a memory.
// ============================================

export async function deleteMemory(memoryId) {
  console.log("[deleteMemory] Removing:", memoryId);

  try {
    const result = await pool.query(
      `
      DELETE FROM memories

      WHERE id = $1

      RETURNING *
      `,
      [memoryId],
    );

    console.log("[deleteMemory] Deleted:", result.rows[0]);
  } catch (error) {
    console.error("[deleteMemory] Error:", error);

    throw error;
  }
}

// ============================================
// UPDATE LAST ACCESSED
//
// Used later for memory ranking.
//
// Example:
// Recently used memories become
// more relevant to the AI.
// ============================================

export async function updateLastAccessed(memoryId) {
  console.log("[updateLastAccessed] Updating:", memoryId);

  try {
    const result = await pool.query(
      `
      UPDATE memories

      SET last_accessed = NOW()

      WHERE id = $1

      RETURNING *
      `,
      [memoryId],
    );

    console.log("[updateLastAccessed] Updated:", result.rows[0]);
  } catch (error) {
    console.error("[updateLastAccessed] Error:", error);

    throw error;
  }
}
