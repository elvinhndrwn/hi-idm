import pool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const userId = query.userId;

    if (!userId) return { success: false, message: "Missing userId" };

    // Ambil semua rolls user
    const result = await pool.query(
      "SELECT * FROM gift_rolls WHERE user_id = $1 ORDER BY created_at ASC",
      [userId]
    );

    const rolls = result.rows;
    const rollsUsed = rolls.length;
    const remainingRolls = Math.max(0, 3 - rollsUsed);

    // Hadiah terakhir (roll terakhir)
    const lastGift = rollsUsed > 0 ? rolls[rollsUsed - 1].gift : null;

    return {
      success: true,
      rollsUsed,
      remainingRolls,
      lastGift,
      rolls,
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to fetch rolls" };
  }
});
