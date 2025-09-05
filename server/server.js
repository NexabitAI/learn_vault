require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const {
  clearUploadFolder,
} = require("./helpers/clearUploads");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: "https://learnifyhub.org",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//database connection
mongoose
  .connect("mongodb://lms_user:StrongLMS%40Pass789@127.0.0.1:27017/LMS?authSource=LMS")
  .then(() => console.log("mongodb is connected"))
  .catch((e) => console.log(e));

//routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use(
  "/student/course-progress",
  studentCourseProgressRoutes
);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(
    express.static(path.join(__dirname, "/client/dist"))
  );

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(
        __dirname,
        "client",
        "dist",
        "index.html"
      )
    )
  );
} else {
  const __dirname = path.resolve();
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}
app.listen(PORT, () => {
  setInterval(() => {
    console.log("Cleaning up...");
    clearUploadFolder();
  }, 86400000);
  console.log(`Server is now running on port ${PORT}`);
});
