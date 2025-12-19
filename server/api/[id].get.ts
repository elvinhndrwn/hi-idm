import pool from "~/server/utils/db";
import { send } from "h3";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing photo id",
    });
  }

  const { rows } = await pool.query(
    `
    SELECT image, mime_type
    FROM photobooth_photos
    WHERE id = $1
    `,
    [id]
  );

  if (rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Image not found",
    });
  }

  const { image, mime_type } = rows[0];

  setHeader(event, "Content-Type", mime_type || "image/jpeg");
  setHeader(event, "Cache-Control", "public, max-age=86400");
  setHeader(event, "Content-Length", image.length);

  return send(event, image);
});
