import pool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing photo id",
    });
  }

  const result = await pool.query(
    `
    SELECT image, mime_type
    FROM photobooth_photos
    WHERE id = $1
    `,
    [id]
  );

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Image not found",
    });
  }

  const { image, mime_type } = result.rows[0];

  setHeader(event, "Content-Type", mime_type);
  return image;
});
