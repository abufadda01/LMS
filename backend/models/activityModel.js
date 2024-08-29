const mongoose = require("mongoose");


const activitySchema = new mongoose.Schema({
  activityFileName: { type: String, required: true },
  file_path: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Lesson', 'Quiz' , "Assignment"],
    required: true
  },
  score: {
    type: mongoose.Schema.Types.Number,
    min: [0, "Score cannot be negative"],
    max: [100, "Score cannot be more than 100"],
    required: true,
  },
  questions: [
    {
      question: { type: String, required: true },
      correctAnswer: { type: String, required: true },
    },
  ],
  maxAttempts: { type: mongoose.Schema.Types.Number , required: true },
  trackingInfo: [{ type: mongoose.Schema.Types.ObjectId , ref: "trackings" }],
});



const Activity = mongoose.model("activites", activitySchema);



module.exports = Activity;
