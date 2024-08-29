const mongoose = require("mongoose");

const studentTrackingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "students",
    required: true,
  },
  score: {
    type: number,
    min: [0, "Score cannot be negative"],
    max: [100, "Score cannot be more than 100"],
    required: true,
  },
  pass: { type: String, required: true },
  completed: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
      correctAnswer: { type: String, required: true },
    },
  ],
  spentTime: { type: number, required: true },
  startingTime: { type: Date, required: true },
  endingTime: { type: Date, required: true },
  activityType: { type: String, required: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  attempts: { type: number, required: true },
});

const studentTrackingModel = mongoose.model(
  "studentTracking",
  studentTrackingSchema
);

export default studentTrackingModel;
