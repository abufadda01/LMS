const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  studentsTracking: [{ type: mongoose.Schema.Types.ObjectId }],
  lessonFilePath: { type: String, required: true },
});

lessonSchema.virtual("studentTracking", {
  ref: "studentTracking",
  localField: "studentsTracking",
  foreignField: "_id",
  justOne: true,
});

const lessonModel = mongoose.model("lessons", lessonSchema);

module.exports = lessonModel;
