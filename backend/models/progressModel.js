const mongoose = require("mongoose")


const ProgressTrackerSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'students' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses' },
    progressPercentage: Number,
    lastAccessed: Date
});


const ProgressTracker = mongoose.model("progressTracker" , ProgressTrackerSchema)


module.exports = ProgressTracker