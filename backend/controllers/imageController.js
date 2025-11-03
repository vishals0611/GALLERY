const multer = require("multer");
const pool = require("../db");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const uploadImage = async (req, res) => {
  const { description } = req.body;
  const userId = req.body.userId;
  const user_id_value = userId && userId !== 'undefined' ? parseInt(userId, 10) : null;

  const filename = req.file.filename;
  const filepath = "uploads/" + filename;

  try {
    const result = await pool.query(
      "INSERT INTO images (filename, path, description, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [filename, filepath, description || "", user_id_value]
    );
    res.json({ success: true, image: result.rows[0] });
  } catch (err) {
    console.error("Upload DB error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
};

const getAllImages = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM images ORDER BY created_at DESC");
    res.json({ success: true, images: result.rows });
  } catch (err) {
    console.error("Fetch images error:", err);
    res.status(500).json({ success: false, message: "Fetch error" });
  }
};

const generateAIDescription = async (req, res) => {
  const imageId = req.params.id;

  try {
    const result = await pool.query("SELECT path FROM images WHERE id = $1", [imageId]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: "Image not found" });

    const imagePath = path.join(__dirname, "..", result.rows[0].path);
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ success: false, message: "File does not exist" });
    }
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this image in detail." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    const description = response.choices[0].message.content;

    await pool.query("UPDATE images SET ai_description = $1 WHERE id = $2", [description, imageId]);

    res.json({ success: true, ai_description: description });
  } catch (error) {
    console.error("Error generating image description:", error);
    res.status(500).json({ success: false, message: "Failed to generate description" });
  }
};

module.exports = { upload, uploadImage, getAllImages, generateAIDescription };
