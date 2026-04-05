const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ message: "Not logged in" });
  }

  // 1. Fetch Teacher
  const teacherQuery = "SELECT full_name FROM create_account WHERE username = ?";
  db.query(teacherQuery, [req.session.username], (err, teacherRows) => {
    if (err || teacherRows.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const teacherName = teacherRows[0].full_name;

    // 2. Fetch Class Setup
    const classQuery = "SELECT * FROM class_setup ORDER BY id DESC LIMIT 1";
    db.query(classQuery, (err, classRows) => {
      if (err || classRows.length === 0) {
        return res.status(404).json({ message: "No class found" });
      }

      // 3. Fetch Sessional Setup (MOST IMPORTANT STEP)
      const sessionalQuery = "SELECT practical_total, project_total FROM sessional_setup ORDER BY id DESC LIMIT 1";
      db.query(sessionalQuery, (err, sessionalRows) => {

        // Even if there is an error here, we create a default object so it's not 'undefined'
        const sessionalData = (sessionalRows && sessionalRows.length > 0) ? sessionalRows[0] : {};

        // 4. Combine everything into ONE response
        const response = {
          ...classRows[0], // Includes subject, semester, number_of_students, etc.
          teacher_name: teacherName,
          practical_status: (sessionalData.practical_total !== null && sessionalData.practical_total !== undefined) ? "Available" : "Unavailable",
          project_status: (sessionalData.project_total !== null && sessionalData.project_total !== undefined) ? "Available" : "Unavailable"
        };

        // 5. Send it ONLY AFTER all queries are done
        console.log("Sending Response:", response); // Check your terminal to see this!
        res.json(response);
      });
    });
  });
});

module.exports = router;