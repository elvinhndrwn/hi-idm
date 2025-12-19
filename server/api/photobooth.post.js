import { v4 as uuid } from "uuid";
import pool from "~/server/utils/db";
import { readMultipartFormData } from "h3";

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);

  const image = form?.find((f) => f.name === "image");
  const sessionField = form?.find((f) => f.name === "sessionId");

  if (!image || !image.data) {
    return { success: false, message: "Image required" };
  }

  const sessionId = sessionField?.data?.toString() || uuid();

  const result = await pool.query(
    `
    INSERT INTO photobooth_photos (session_id, image, mime_type)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
    [sessionId, image.data, image.type || "image/jpeg"]
  );

  return {
    success: true,
    data: {
      id: result.rows[0].id,
      sessionId,
    },
  };
});
