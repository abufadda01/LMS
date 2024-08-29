const createError = require("../utils/createError")

const mongoose = require("mongoose");

const Course = require("../models/courseModel");
const User = require("../models/userModel");
const Student = require("../models/studentModel");
const Payment = require("../models/paymentModel");




const getAllCourses = async (req , res , next) => {

    try {

        const page = Number(req.query.page) || 1
        const limit = 10
        const skip = (page - 1) * limit
        
        const totalCourses = await Course.countDocuments();

        const courses = await Course.find({})
            .select("-studentsEnrolled -paymentCourses")
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            courses ,
            page ,
            totalPages : Math.ceil(totalCourses / limit)
        })

    } catch (error) {
        next(error)
    }
}




const getCourseById = async (req, res, next) => {

  try {

    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .select('-paymentCourses')
      .populate("instructorId" , "name") 

    if (!course) {
      return next(createError("Course not found", 404));
    }

    const sectionsNum = course.sections.length; 

    const { sections , ...rest } = course.toObject();

    res.status(200).json({ course: rest, sectionsNum }); 

  } catch (error) {
    next(error);
  }

}




// with payment
const courseEnrollment = async (req , res , next) => {

  try {

    const {courseId} = req.params

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course not found", 404));
    }

    const studentUser = await Student.findOne({userObjRef : req.user._id})

    const isStudentAlreadyRegistered = course.studentsEnrolled.includes(studentUser._id)

    if(isStudentAlreadyRegistered){
      return next(createError("you already registered with this course", 400));
    }

    const newPayment = new Payment({
      courseId : course._id ,
      studentId : studentUser._id ,
      amount : course.price ,
      paymentStatus : "success"
    })

    await newPayment.save()

    course.studentsEnrolled.push(studentUser._id)
    course.paymentCourses.push(newPayment._id)
    
    await course.save()

    res.status(200).json(course)

  } catch (error) {
    next(error)
  }
}
  
  



module.exports = {getAllCourses , getCourseById , courseEnrollment}