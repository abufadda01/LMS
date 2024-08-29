const Student = require("../models/studentModel");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const CourseEnrolRequestModel = require("../models/StudentCourseRequestModel");
const createError = require("../utils/createError");

 

const getAllStudentCourses = async (req , res , next) => {

    try {
        
        const student = await Student.findOne({userObjRef : req.user._id})

        if(student){
            return next(createError("student not exist" , 404))
        }
        
    } catch (error) {
        
    }
}




// without payment
const courseEnrolRequest = async (req , res , next) => {

    try {

        const { firstName , lastName , email , phone , address , city , courseId } = req.body;

        if(!firstName || !lastName || !email || !phone || !address || !city){
            return next(createError("please provide all fields" , 400))
        }

        const course = await Course.findById(courseId)

        if(!course){
            return next(createError("course not found" , 404))
        }

        const studentUser = await Student.findOne({userObjRef : req.user._id})

        if(!studentUser){
            return next(createError("student not exist" , 404))
        }

        const isStudentAlreadyEnroled = studentUser.coursesEnrolled.includes(course._id) || course.studentsEnrolled.includes(studentUser._id)

        if(isStudentAlreadyEnroled){
            return next(createError("student already enroled in this course" , 400))
        }

        const isStudentAlreadyReqEnrolment = await CourseEnrolRequestModel.findOne({courseId : course._id , studentId : studentUser._id})

        if(isStudentAlreadyReqEnrolment){
            return next(createError("student already request enrolment to this course" , 400))
        }

        const courseNewEnrolReq = new CourseEnrolRequestModel({
            firstName ,
            lastName ,
            email ,
            phone ,
            address ,
            city ,
            courseId : course._id,
            studentId : studentUser._id
        })

        await courseNewEnrolReq.save()

        res.status(201).json({ status: courseNewEnrolReq.status, alreadyRequested: false });

    } catch (error) {
        next(error)
    }
}




const getMyEnrolmentRequests = async (req , res , next) => {

    try {
        
        const page = Number(req.query.page) || 1
        const limit = 10
        const skip = (page - 1) * limit

        const studentUser = await Student.findOne({userObjRef : req.user._id})

        if(!studentUser){
            return next(createError("student not exist" , 404))
        }
        
        const studentAllRequests = await CourseEnrolRequestModel.find({studentId : studentUser._id}).skip(skip).limit(limit)

        const totalDoc = await CourseEnrolRequestModel.countDocuments({studentId : studentUser._id})
        
        res.status(200).json({
            studentAllRequests ,
            page ,
            totalPages : Math.ceil(totalDoc / limit) ,
            totalDoc
        })
 
    } catch (error) {
        next(error)
    }

}





const checkEnrollmentStatus = async (req, res, next) => {

    try {

      const { courseId } = req.params;
      const studentUser = await Student.findOne({ userObjRef: req.user._id });
  
      if (!studentUser) {
        return next(createError("Student not found", 404));
      }
  
      const enrollmentRequest = await CourseEnrolRequestModel.findOne({ courseId, studentId: studentUser._id });
  
      if (enrollmentRequest) {
        return res.status(200).json({
          alreadyRequested: true,
          status: enrollmentRequest.status,
        });
      }
  
      res.status(200).json({
        alreadyRequested: false,
      });

    } catch (error) {
      next(error);
    }
  };




module.exports = {
    getAllStudentCourses , 
    courseEnrolRequest , 
    getMyEnrolmentRequests,
    checkEnrollmentStatus
}