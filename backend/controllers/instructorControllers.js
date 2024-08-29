const Instructor = require("../models/instructorModel");
const createError = require("../utils/createError");
const Course = require("../models/courseModel");
const Joi = require("joi");
const User = require("../models/userModel");
const Student = require("../models/studentModel");
const mongoose = require("mongoose");
const {Attachment} = require("../models/attachmentModel");
const ObjectId = mongoose.Types.ObjectId;

const fs = require("fs")
const path = require("path")


const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
          if (err) {
              return reject(err);
          }
          resolve();
      });
  });
};




const getAllInstructors = async (req, res, next) => {
  try {
    const instructors = await Instructor.find().populate("userObjRef");
    res.status(200).json(instructors);
  } catch (error) {
    next(error);
  }
};




const getAllInstructorCourses = async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    
    const instructor = await Instructor.findOne({ userObjRef: req.user._id });

    if (!instructor) {
      return next(createError("Instructor not found", 404));
    }

    const totalCourses = await Course.countDocuments({ instructorId: instructor._id });
    const totalPages = Math.ceil(totalCourses / limit);

    const skip = (page - 1) * limit;

    // find all courses that the _id key is inside instructor.coursesTeaching
    const courses = await Course.find({ _id: { $in: instructor.coursesTeaching } })
    .skip(skip)
    .limit(limit);

    res.status(200).json({
      courses,
      totalCourses,
      totalPages,
      currentPage: page,
    });

  } catch (error) {
    next(error);
  }
};





//  needs update or create a new route for admin to make him could create a new course , change course owner (instructor)
const createCourse = async (req, res, next) => {

  const courseSchema = Joi.object({
    title: Joi.string().required(),
    startDate : Joi.string().required(),
    endDate : Joi.string().required()
  });

  const { value, error } = courseSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(createError("Invalid Course data", 400));
  }

  try {
    
    const { title, startDate , endDate } = value;

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return next(createError("Invalid date format", 400));
    }

    if (startDateObj < today) {
      return next(createError("Start date must be today or later", 400));
    }

    if (startDateObj >= endDateObj) {
      return next(createError("End date must be after the start date", 400));
    }

    const userId = req.user._id;

    const instructor = await Instructor.findOne({ userObjRef: userId });

    if(req.user.role !== "instructor" && req.user.role !== "admin"){
      return next(createError("You don't have access to create this course", 401));
    }

    const course = new Course({
      title,
      startDate,
      endDate,
      instructorId: instructor._id,
    });

    await course.save();

    await Instructor.updateOne(
      { _id: instructor._id },
      { $push: { coursesTeaching: course._id } }
    );

    res.status(201).json(course);

  } catch (error) {
    next(error);
  }
};





const deleteCourse = async (req, res, next) => {

  try {

    const { courseId } = req.params;

    // Find the course by ID

    const course = await Course.findById(courseId);

    if (!course) {
      return next(createError("Course not found", 404));
    }

    // Find the instructor associated with the logged-in user
    const instructor = await Instructor.findOne({ userObjRef: req.user._id });

    if(req.user.role !== "instructor" && req.user.role !== "admin"){
      return next(createError("You don't have access to delete this course", 401));
    }

    if (instructor && course.instructorId.toString() !== instructor._id.toString()) {
      return next(createError("You don't have access to delete this course", 401));
    }


    // Check if the course belongs to the instructor

    // Remove the course ID from the instructor's coursesTeaching array using $pull
    await Instructor.updateOne(
      { _id: instructor._id },
      { $pull: { coursesTeaching: course._id } }
    );

    // Delete the course from the database
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};




const viewCourseStudents = async (req, res, next) => {

  try {

    const {courseId} = req.params;
    const userId = req.user._id;

    const instructor = await Instructor.findOne({ userObjRef: userId });

    if(req.user.role !== "instructor" && req.user.role !== "admin"){
      return next(createError("You don't have access to delete this section", 401));
    }

    if (instructor && course.instructorId.toString() !== instructor._id.toString()) {
      return next(createError("You don't have access to delete this section", 401));
    }

    const courseExist = instructor.coursesTeaching.find(
      (course) => course.toString() === courseId.toString()
    );

    if (!courseExist) {
      return next(createError(`Course not exist for ${instructor.name}`, 404));
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return next(createError("Course not found", 404));
    }

    if (
      course.instructorId.toString() !== instructor._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(
        createError(
          "you are not authorized to view course enrolled students",
          404
        )
      );
    }

    const courseEnrolledStudents = await Promise.all(
      course.studentsEnrolled.map((student) => {
        return Student.findById(student);
      })
    );

    res.status(200).json(courseEnrolledStudents);

  } catch (error) {
    next(error);
  }
};




const getCourseById = async (req , res , next) => {

  try {
    
    const {courseId} = req.params
    
    const course = await Course.findById(courseId).select("-studentsEnrolled -paymentCourses")

    if (!course) {
      return next(createError("Course not found", 404));
    }

    res.status(200).json(course);

  } catch (error) {
    next(error)
  }
}




const updateCourseSections = async (req , res , next) => {

  try {

    const {courseId} = req.params
    const {sections} = req.body
    const userId = req.user._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return next(createError("Course not found", 404));
    }

    const instructor = await Instructor.findOne({ userObjRef: userId });

    if(req.user.role !== "instructor" && req.user.role !== "admin"){
      return next(createError("You don't have access to update this section", 401));
    }

    if (instructor && course.instructorId.toString() !== instructor._id.toString()) {
      return next(createError("You don't have access to update this section", 401));
    }


    // for (const section of sections) {

    //   for (const item of section.items) {

    //     if (item.attachments && item.attachments.length > 0) {

    //       for (const attachment of item.attachments) {

    //         // Create or update attachment
    //         let existingAttachment;

    //         if (attachment._id) {
    //           existingAttachment = await Attachment.findById(attachment._id);
    //         }

    //         if (existingAttachment) {

    //           // Update existing attachment
    //           existingAttachment.file_path = attachment.file_path;
    //           existingAttachment.attachment_name = attachment.attachment_name;
    //           existingAttachment.type = attachment.type;
    //           await existingAttachment.save();

    //         } else {

    //           // Create new attachment
    //           const newAttachment = new Attachment({
    //             file_path: attachment.file_path,
    //             attachment_name: attachment.attachment_name,
    //             type: attachment.type
    //           });

    //           await newAttachment.save();
    //           item.attachments.push(newAttachment._id);

    //         }

    //       }

    //     }
    //   }
    // }

    course.sections = sections;

    await course.save();

    res.status(200).json(course);
  
  } catch (error) {
    next(error)
  }
}




const deleteCourseSection = async (req, res, next) => {

  try {

    const { courseId, sectionId } = req.params;
    
    const userId = req.user._id;

    if (!ObjectId.isValid(courseId) || !ObjectId.isValid(sectionId)) {
      return next(createError("Invalid course or section ID", 400));
    }

    const courseObjectId = new ObjectId(courseId);
    const sectionObjectId = new ObjectId(sectionId);

    const course = await Course.findById(courseObjectId);

    if (!course) {
      return next(createError("Course not found", 404));
    }

    const instructor = await Instructor.findOne({ userObjRef: userId });

    if(req.user.role !== "instructor" && req.user.role !== "admin"){
      return next(createError("You don't have access to delete this section", 401));
    }

    if (instructor && course.instructorId.toString() !== instructor._id.toString()) {
      return next(createError("You don't have access to delete this section", 401));
    }


    const sectionIndex = course.sections.findIndex(section => section._id.toString() === sectionObjectId.toString());

    if (sectionIndex === -1) {
      return next(createError("Section not found", 404));
    }

    course.sections.splice(sectionIndex, 1);

    await course.save();

    res.status(200).json(course);

  } catch (error) {
    next(error);
  }
};





const deleteCourseItem = async (req, res, next) => {

  try {
    
    const { courseId, sectionId, itemId } = req.params;
    const userId = req.user._id;

    if (!ObjectId.isValid(courseId) || !ObjectId.isValid(sectionId) || !ObjectId.isValid(itemId)) {
      return next(createError("Invalid ID(s) provided", 400));
    }

    const courseObjectId = new ObjectId(courseId);
    const sectionObjectId = new ObjectId(sectionId);
    const itemObjectId = new ObjectId(itemId);

    const course = await Course.findById(courseObjectId);

    if (!course) {
      return next(createError("Course not found", 404));
    }

    const instructor = await Instructor.findOne({ userObjRef: userId });

    if(req.user.role !== "instructor" && req.user.role !== "admin"){
      return next(createError("You don't have access to delete this section item", 401));
    }

    if (instructor && course.instructorId.toString() !== instructor._id.toString()) {
      return next(createError("You don't have access to delete this section item", 401));
    }


    const section = course.sections.find(section => section._id.toString() === sectionObjectId.toString());

    if (!section) {
      return next(createError("Section not found", 404));
    }

    const itemIndex = section.items.findIndex(item => item._id.toString() === itemObjectId.toString());

    if (itemIndex === -1) {
      return next(createError("Item not found", 404));
    }

    const item = section.items[itemIndex];

    
    if (item.attachments && item.attachments.length > 0) {

      for (const attachment of item.attachments) {

        const filePath = attachment.file_path;

        try {

          if (fs.existsSync(filePath)) {
            await deleteFile(filePath);
          } else {
            console.warn(`File not found: ${filePath}`);
          }

        } catch (err) {
          console.error(`Failed to delete file ${filePath}:`, err);
        }

        try {

          const deletedAttachment = await Attachment.findByIdAndDelete(attachment._id);

          if (!deletedAttachment) {
            console.error(`Failed to delete attachment with ID ${attachment._id}`);
          }

        } catch (err) {
          console.error(`Failed to delete attachment from database:`, err);
        }
      }

      item.attachments = [];

    }

    section.items.splice(itemIndex, 1);

    await course.save();

    res.status(200).json(course);

  } catch (error) {
    next(error);
  }
};






module.exports = {
  getAllInstructors,
  getAllInstructorCourses,
  createCourse,
  deleteCourse,
  viewCourseStudents,
  getCourseById,
  updateCourseSections,
  deleteCourseSection,
  deleteCourseItem
};
