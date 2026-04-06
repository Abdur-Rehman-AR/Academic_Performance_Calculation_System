const express = require("express");
const router = express.Router();
const db = require("../db"); // your database connection

// ================= WEIGHTAGE CALCULATOR API =================
router.get("/", async (req, res) => {
    console.log("Weightage API was called!");
  try {
    const [rows] = await db.promise().query("SELECT * FROM sessional_setup ORDER BY id DESC LIMIT 1");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No sessional setup found" });
    }

    const setup = rows[0]; // get the latest setup

    res.json({
      mid_total: setup.mid_total,
      mid_weight: setup.mid_weight,
      final_total: setup.final_total,
      final_weight: setup.final_weight,
      practical_total: setup.practical_total,
      practical_weight: setup.practical_weight,
      assignment_total: setup.assignment_total,
      assignment_weight: setup.assignment_weight,
      quizzes_total: setup.quizzes_total,
      quizzes_weight: setup.quizzes_weight,
      presentation_total: setup.presentation_total,
      presentation_weight: setup.presentation_weight,
      project_total: setup.project_total,
      project_weight: setup.project_weight
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;