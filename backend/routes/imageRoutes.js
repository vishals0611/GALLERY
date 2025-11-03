const express = require("express");
const router = express.Router();
const { upload, uploadImage, getAllImages, generateAIDescription } = require("../controllers/imageController");

router.post("/upload", upload.single("image"), uploadImage);

router.get("/", getAllImages);

router.post('/:id/generate-description', generateAIDescription);

module.exports = router;
