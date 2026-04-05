const express = require("express");
const router = express.Router();
const db = require("../db");

// ================= LOGIN API =================
router.post("/", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM create_account WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.json({ success: false, message: err.message });
    }

    if (result.length > 0) {
      const user = result[0];

      // ✅ Store username in session (instead of ID)
      req.session.username = user.username;

      res.json({
        success: true,
        message: "Login successful!",
        teacher_name: user.full_name
      });

    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  });
});

module.exports = router;