import pool from "~/server/utils/db";

const gifts = [
  "Sepatu",
  "Octopay 50K",
  "Zonk 😭",
  "Pulsa 100K",
  "Traktir Makan Sushi",
  "Baju",
  "Mie Goreng Satu Kardus",
  "Dompet",
  "Zonk 😭",
  "Buku",
  "Skincare",
];

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { userId, dice1, dice2 } = body;

    if (!userId || dice1 == null || dice2 == null) {
      return { success: false, message: "Missing data" };
    }

    const total = dice1 + dice2;
    const gift = gifts[total - 2];

    // Simpan roll
    const result = await pool.query(
      `INSERT INTO gift_rolls (user_id, dice1, dice2, total, gift) 
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [userId, dice1, dice2, total, gift]
    );

    // Hitung remaining roll (misal max 3 per user)
    const maxRolls = 3;
    const rollsCount = await pool.query(
      `SELECT COUNT(*) FROM gift_rolls WHERE user_id = $1`,
      [userId]
    );
    const remainingRolls = Math.max(
      maxRolls - parseInt(rollsCount.rows[0].count),
      0
    );

    return {
      success: true,
      data: result.rows[0],
      gift,
      lastGift: gift,
      remainingRolls,
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to save roll" };
  }
});
