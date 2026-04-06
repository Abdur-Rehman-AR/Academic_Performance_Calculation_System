const express = require("express");
const router = express.Router();
const db = require("../db"); // your mysql connection

// GET latest session info for result page
router.get("/", async (req, res) => {
  try {
    // 1. Get latest class setup
    const [classData] = await db.promise().query(
      "SELECT * FROM class_setup ORDER BY id DESC LIMIT 1"
    );

    // 2. Get latest sessional setup
    const [sessionData] = await db.promise().query(
      "SELECT * FROM sessional_setup ORDER BY id DESC LIMIT 1"
    );

    // 3. Get latest teacher
    const [teacherData] = await db.promise().query(
      "SELECT full_name FROM create_account ORDER BY id DESC LIMIT 1"
    );

    // 4. Get all student marks
    const [studentsData] = await db.promise().query(
      "SELECT * FROM student_marks"
    );

    if (!classData.length || !sessionData.length) {
      return res.status(404).json({ message: "No data found" });
    }

    const classInfo = classData[0];
    const sessionInfo = sessionData[0];
    const teacher = teacherData[0];

    // Prepare students with null checks
    const students = studentsData.map(s => ({
      name: s.student_name,
      mid: s.mid_marks,
      final: s.final_marks,
      assignment: s.assignment_marks,
      quizzes: s.quizzes_marks,
      presentation: s.presentation_marks,
      practical: s.practical_marks,
      project: s.project_marks
    }));

    res.json({
      subject: classInfo.subject,
      semester: classInfo.semester,
      department: classInfo.department,
      shift: classInfo.shift,
      teacher_name: teacher ? teacher.full_name : "Unknown",

      // weights
      mid_weight: sessionInfo.mid_weight,
      final_weight: sessionInfo.final_weight,
      assignment_weight: sessionInfo.assignment_weight,
      quizzes_weight: sessionInfo.quizzes_weight,
      presentation_weight: sessionInfo.presentation_weight,
      practical_weight: sessionInfo.practical_weight,
      project_weight: sessionInfo.project_weight,

      // check for nulls
      practical_total: sessionInfo.practical_total,
      project_total: sessionInfo.project_total,

      students
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;