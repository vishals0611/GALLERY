const pool = require("../db");

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email, password);
  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

   if (user.rows.length > 0) {
  res.json({
    success: true,
    message: "Login successful",
    userId: user.rows[0].id,
    email: user .rows[0].email
  });
} else {
  res.status(401).json({ success: false, message: "Invalid credentials" });
}

  } catch (err) {
    console.error("❌ Login error:", err);  
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { login };
