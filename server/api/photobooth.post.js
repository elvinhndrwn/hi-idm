import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import pool from "~/server/utils/db"; // gunakan pool sesuai setup kita sebelumnya

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { imageBase64, sessionId } = body;

    if (!imageBase64) {
      return { success: false, message: "Image is required" };
    }

    const sid = sessionId || uuidv4();
    const filename = `${sid}_${Date.now()}.png`;
    // const photosDir = path.resolve("./public/photos");
    // if (!fs.existsSync(photosDir)) fs.mkdirSync(photosDir, { recursive: true });

    // const filepath = path.join(photosDir, filename);
    // const buffer = Buffer.from(imageBase64.split(",")[1], "base64");
    // fs.writeFileSync(filepath, buffer);

    // simpan ke database
    const result = await pool.query(
      `INSERT INTO photobooth_photos (session_id, photo_url, raw)
   VALUES ($1, $2, $3)
   RETURNING *`,
      [
        sid,
        `/photos/${filename}`,
        imageBase64, // ✅ SIMPAN BASE64 APA ADANYA
      ]
    );

    return { success: true, data: result.rows[0], sessionId: sid };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to save photo" };
  }
});
