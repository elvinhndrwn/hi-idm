import { v4 as uuidv4 } from "uuid";
import pool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { imageBase64, sessionId } = body;

    if (!imageBase64) {
      return { success: false, message: "Image is required" };
    }

    const sid = sessionId || uuidv4();

    // Parse base64 → buffer
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return { success: false, message: "Invalid image format" };
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");

    const result = await pool.query(
      `
      INSERT INTO photobooth_photos (session_id, image, mime_type)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [sid, buffer, mimeType]
    );

    return {
      success: true,
      data: {
        id: result.rows[0].id,
        sessionId: sid,
      },
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to save photo" };
  }
});
