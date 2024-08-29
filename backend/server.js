const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path")
const fs = require("fs")
const compression = require("compression")
const fileUpload = require("express-fileupload");
const connectDB = require("./db/connectDB");
const errorHandler = require("./middlewares/errorHandler");

require("dotenv").config({ path: "./.env" });
require("colors");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(fileUpload());
app.use(express.static("public"));

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// third party middlewares

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


const uploadDir = path.join(__dirname, 'public');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


app.get("/root", (req, res) => {
  res.sendFile(path.join(process.env.PUBLIC_PATH, "build", "index.html"));
});



// routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/auth", userRoutes);

const ticketsRoutes = require("./routes/ticketsRoutes");
app.use("/api/tickets", ticketsRoutes);

const instructorRoutes = require("./routes/instructorRoutes");
app.use("/api/instructor", instructorRoutes);
  
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/student", studentRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const attachmentRoutes = require("./routes/attachmentRoutes");
app.use("/api/attachment", attachmentRoutes);

const trackingRoute = require("./routes/trackingRoutes");
app.use("/api/tracking", trackingRoute);

const coursesRoute = require("./routes/courseRoutes");
app.use("/api/courses", coursesRoute);



// custom middlewares for error handling
app.use(errorHandler);


const PORT = process.env.PORT;

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`lms server started on port ${PORT}`.yellow.bold));
    await connectDB();
  } catch (error) {
    console.log(error)
  }
};


start();












// app.post("/api/attachment/:courseId/:sectionId/:itemId", async (req, res , next) => {
  
//   const { score, questions, maxAttempts , type} = req.body;
//   const { courseId, sectionId, itemId } = req.params;

//   if (!req.files || !req.files.activityFile) {
//     return res.status(400).send("No files were uploaded.");
//   }

//   const activityFile = req.files.activityFile;
//   const fileName = `activity-${Date.now()}-${activityFile.name}`;
//   const filePath = path.join(process.env.PUBLIC_PATH, fileName);

//   try {

//     const validTypes =  ['Video', 'image' , "Activity"];

//     if (!validTypes.includes(type)) {
//         return next(createError("Invalid attachment type", 400));
//     }

//     const course = await Course.findById(courseId);


//     if (!course) {
//         return next(createError("Course with this id not found", 404));
//     }

//     const section = course.sections.id(sectionId);

//     if (!section) {
//         return next(createError("Section with this id not found", 404));
//     }

//     const item = section.items.id(itemId);
    
//     if (!item) {
//         return next(createError("Item with this id not found", 404));
//     }

//     if(item.attachments.length > 0){
//         return next(createError("you can add only one attachment for each item", 400));
//     }


//     let parsedQuestions;

//     try {
//       parsedQuestions = JSON.parse(questions);
//     } catch (error) {
//       return next(createError("Invalid questions format", 400));
//     }

//     // Save the file
//     await activityFile.mv(filePath);

//     // Create a ZIP file with the uploaded file
//     const zip = new AdmZip();
//     zip.addLocalFile(filePath);

//     const zipFileName = `${fileName}.zip`;
//     const zipFilePath = path.join(process.env.PUBLIC_PATH, zipFileName);
//     zip.writeZip(zipFilePath);

//     // Delete the original file after creating the ZIP
//     fs.unlinkSync(filePath);

//     // Save activity details to the database
//     const activity = new Attachment({
//       type,
//       score: Number(score),
//       questions: JSON.parse(questions),
//       maxAttempts: Number(maxAttempts),
//       file_path: zipFilePath ,
//       activityFileName : zipFileName
//     });

//     await activity.save();

//     item.attachments.push(activity);

//     await course.save();

//     res.status(200).json(course);

//   } catch (error) {
//     console.error("Error uploading activity:", error);
//     res.status(500).send("Internal server error");
//   }
// });
