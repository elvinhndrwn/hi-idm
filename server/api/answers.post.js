import pool from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // ambil request body
  const { question, answer } = body;

  if (!question || !answer) {
    return { success: false, message: "Question and answer required" };
  }

  try {
    const result = await pool.query(
      "INSERT INTO answers (question, answer) VALUES ($1, $2) RETURNING *",
      [question, answer]
    );
    return { success: true, data: result.rows[0] };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to save answer" };
  }
});
