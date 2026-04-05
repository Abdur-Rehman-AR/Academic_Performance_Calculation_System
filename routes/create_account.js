const express = require("express");
const router = express.Router();
const db = require("../db");

// ================= REGISTER API =================
router.post("/register", (req, res) => {
  const { fullName, username, password } = req.body;

  const checkUser = "SELECT * FROM create_account WHERE username = ?";

  db.query(checkUser, [username], (err, result) => {
    if (err) return res.json({ success: false, message: err.message });

    if (result.length > 0) {
      return res.json({ success: false, message: "Username already exists" });
    }

    const insertQuery = "INSERT INTO create_account (full_name, username, password) VALUES (?, ?, ?)";

    db.query(insertQuery, [fullName, username, password], (err, result) => {
      if (err) {
        return res.json({ success: false, message: err.message });
      }
      res.json({ success: true, message: "Account created successfully!" });
    });
  });
});

// ================= LOGIN API =================
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM create_account WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, result) => {
    if (err) return res.json({ success: false, message: err.message });

    if (result.length > 0) {
      res.json({ success: true, message: "Login successful!" });
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  });
});

module.exports = router;