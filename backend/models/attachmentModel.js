const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const attachmentSchema = new Schema({
  file_path: {
    type: String,
    required: true,
  },
  activityFileName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Video', 'Image' , "Activity"],
    required: true
  },
  score: {
    type: mongoose.Schema.Types.Number,
    min: [0, "Score cannot be negative"],
    max: [100, "Score cannot be more than 100"],
  },
  passScore: {
    type: mongoose.Schema.Types.Number,
    min: [0, "Score cannot be negative"],
    max: [100, "Score cannot be more than 100"],
  },
  questions: [
    {
      question: { type: String },
      correctAnswer: { type: String},
      questionType: {type: String , enum: ['MC', 'T/F' , "essay" , "Fill_Blank"] },
      choices : [String],
      mark : { type: Number }
    },
  ],
  maxAttempts: { type: mongoose.Schema.Types.Number , required: true },
  trackingInfo: [{ type: mongoose.Schema.Types.ObjectId , ref: "trackings" }],
});


const Attachment = mongoose.model('attachments', attachmentSchema);


module.exports = {attachmentSchema , Attachment}; 
