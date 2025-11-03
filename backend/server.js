const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes"); 
const imageRoutes = require("./routes/imageRoutes");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/gallery", imageRoutes);

app.get("/", (req, res) => res.send("✅ Backend running"));

const PORT = 8000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
