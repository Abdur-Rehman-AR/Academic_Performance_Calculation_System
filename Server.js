const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

const session = require("express-session");

app.use(session({
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: true
}));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend"))); // serve frontend files

// Example: API routes
app.use("/login", require("./routes/login"));
app.use("/create-account", require("./routes/create_account"));
app.use("/class-setup", require("./routes/class_setup"));
app.use("/sessional-setup", require("./routes/sessional_setup"));
app.use("/latest-session", require("./routes/latest_session"));
app.use("/student-marks", require("./routes/student_marks"));

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});