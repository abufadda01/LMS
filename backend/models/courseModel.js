const mongoose = require("mongoose");
const {attachmentSchema , Attachment} = require("./attachmentModel");


const ItemSchema = new mongoose.Schema({
  type: String,
  name: String,
  attachments: [attachmentSchema],
});


const SectionSchema = new mongoose.Schema({
  name: String,
  items: [ItemSchema],
});


const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    default : 5 ,
    min: [1, "Rate cannot be negative"],
    max: [10, "course max rate 10"],
  },
  sections: [SectionSchema],
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructors",
    required: true,
    default : null
  },
  price : { type: Number } ,
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "quizes" }],
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "lessons" }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "assigments" }],
  paymentCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "payments" }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});



CourseSchema.virtual("instructor", {
  ref: "instructors",
  localField: "instructorId",
  foreignField: "_id",
  justOne: true,
});




CourseSchema.pre("remove", async function (next) {

  const course = this;
  const sectionIds = course.sections.map(section => section._id);
  const itemIds = course.sections.flatMap(section => section.items.map(item => item._id));

  await Attachment.deleteMany({ section: { $in: sectionIds } });
  await Attachment.deleteMany({ item: { $in: itemIds } });

  next();
  
});




const Course = mongoose.model("courses", CourseSchema);

module.exports = Course;
