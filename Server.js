const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const db = require("./db");
const app = express();

// 1. GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(session({
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: true
}));

// 2. SERVE FRONTEND FILES
app.use(express.static(path.join(__dirname, "frontend"))); 

// 3. ROUTE MOUNTING
app.use("/login", require("./routes/login"));
app.use("/create-account", require("./routes/create_account"));
app.use("/class-setup", require("./routes/class_setup"));
app.use("/sessional-setup", require("./routes/sessional_setup"));
app.use("/latest-session", require("./routes/latest_session"));
app.use("/student-marks", require("./routes/student_marks"));
app.use("/result-view", require("./routes/result_view"));
app.use("/weightage-calculater", require("./routes/weightage_calculater"));

// DELETE route to clear the student_marks table
app.delete('/clear-results', (req, res) => {
    // This SQL command only deletes rows from the student_marks table
    const sql = "DELETE FROM student_marks";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database error while clearing table:", err);
            // Return a 500 error if something went wrong with the SQL
            return res.status(500).json({ 
                success: false, 
                message: "Database deletion failed" 
            });
        }
        
        // Return a 200 success code if rows were deleted
        console.log("Student marks table cleared successfully.");
        res.status(200).json({ 
            success: true, 
            message: "Student marks table cleared successfully" 
        });
    });
});

// 4. SIMPLE ROUTE VERIFICATION (Safer Version)
app.get("/check-routes", (req, res) => {
    res.json({ message: "Server is alive and routes are mapped!" });
});

// 5. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 UOE System running at http://localhost:${PORT}`);
});