const mongoose = require("mongoose");


const paymentCourseSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses' , required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'students' , required: true },
    amount: {
        type: Number,
        required: true,
        min: [0, "Amount cannot be negative"]
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum : ["success" , "failed"] ,
        required: true
    }
}, { timestamps: true });



paymentCourseSchema.virtual('course', {
    ref: 'courses',
    localField: 'courseId',
    foreignField: '_id',
    justOne: true
});


const Payment = mongoose.model("payments", paymentCourseSchema);


module.exports = Payment;
