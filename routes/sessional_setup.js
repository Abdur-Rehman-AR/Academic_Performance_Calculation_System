const express = require("express");
const router = express.Router();
const db = require("../db"); // Make sure this points to your db.js

router.post("/", (req, res) => {
  const data = req.body;

  const sql = `
    INSERT INTO sessional_setup
    (mid_total, mid_weight, final_total, final_weight, practical_total, practical_weight,
     assignment_total, assignment_weight, quizzes_total, quizzes_weight,
     presentation_total, presentation_weight, project_total, project_weight, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const values = [
    data.mid.total, data.mid.weight,
    data.final.total, data.final.weight,
    data.practical?.total || null, data.practical?.weight || null,
    data.assignment.total, data.assignment.weight,
    data.quizzes.total, data.quizzes.weight,
    data.presentation.total, data.presentation.weight,
    data.project?.total || null, data.project?.weight || null
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("DB Error:", err); // <<<<<< Check this in terminal
      return res.status(500).send("Database error");
    }
    res.send("Sessional setup saved successfully!");
  });
});

module.exports = router;