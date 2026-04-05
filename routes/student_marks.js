const express = require("express");
const router = express.Router();
const db = require("../db");

// POST student marks
router.post("/", (req, res) => {
  const { students, sessional_id } = req.body;

  if (!students || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: "No student data provided" });
  }

  const insertQuery = `
    INSERT INTO student_marks 
    (student_name, mid_marks, final_marks, assignment_marks, quizzes_marks, presentation_marks, practical_marks, project_marks, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  let completed = 0;
  let hasError = false;

  students.forEach((student) => {
    const {
      student_name,
      mid_marks,
      final_marks,
      assignment_marks,
      quizzes_marks,
      presentation_marks,
      practical_marks,
      project_marks,
    } = student;

    db.query(
      insertQuery,
      [
        student_name,
        mid_marks,
        final_marks,
        assignment_marks,
        quizzes_marks,
        presentation_marks,
        practical_marks || null,
        project_marks || null,
      ],
      (err) => {
        if (err && !hasError) {
          hasError = true;
          console.error("Error inserting marks:", err);
          return res.status(500).json({ message: "Server error" });
        }

        completed++;

        if (completed === students.length && !hasError) {
          res.json({ message: "Marks saved successfully" });
        }
      }
    );
  });
});

module.exports = router;