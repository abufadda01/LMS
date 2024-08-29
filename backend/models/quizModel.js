const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    quizDuration: {
      type: Number,
      required: true,
    },
    studentsTracking: [{ type: mongoose.Schema.Types.ObjectId }],
    maxAttemptes: { type: number, min: 1 },
  },
  { timestamps: true }
);

quizSchema.virtual("course", {
  ref: "courses",
  localField: "courseId",
  foreignField: "_id",
  justOne: true,
});

quizSchema.virtual("studentTracking", {
  ref: "studentTracking",
  localField: "studentsTracking",
  foreignField: "_id",
  justOne: true,
});

const Quiz = mongoose.model("quizes", quizSchema);

module.exports = Quiz;
