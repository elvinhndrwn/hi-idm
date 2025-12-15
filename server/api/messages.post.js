import pool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { userId, message } = body;

    if (!userId || !message?.trim()) {
      return { success: false, message: "Missing data" };
    }

    await pool.query(
      `INSERT INTO couple_messages (user_id, message) VALUES ($1, $2)`,
      [userId, message.trim()]
    );

    return { success: true, message: "Pesan berhasil dikirim 💖" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Gagal mengirim pesan 😢" };
  }
});
