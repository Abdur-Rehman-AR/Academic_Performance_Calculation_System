const express = require("express");
const router = express.Router();
const db = require("../db");

// API to insert class setup data
router.post("/", (req, res) => {
    const { department, semester, shift, subject, students } = req.body;

    const sql = `
    INSERT INTO class_setup 
    (department, semester, shift, subject, number_of_students)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.query(sql, [department, semester, shift, subject, students], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error saving data");
        } else {
            res.send("Class setup saved successfully!");
        }
    });
});

module.exports = router;