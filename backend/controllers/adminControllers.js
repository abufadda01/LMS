const createError = require("../utils/createError")
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel")
const Instructor = require("../models/instructorModel");
const Course = require("../models/courseModel");
const { default: mongoose } = require("mongoose");
const { Attachment } = require("../models/attachmentModel");
const path = require("path")
const fs = require("fs")
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcrypt");
const Student = require("../models/studentModel");
const CourseEnrolRequestModel = require("../models/StudentCourseRequestModel");




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



const getAllTickets = async (req , res , next) => {
    
    try {
        
        const page = parseInt(req.query.page) || 1;
        
        const limit = 10;

        const skip = (page - 1) * limit;

        let allTickets = await Ticket.find().skip(skip).limit(limit)
        
        allTickets = allTickets.filter(ticket => ticket !== undefined && ticket !== null);

        const totalTickets = await Ticket.countDocuments();

        res.status(200).json({
            totalTickets,
            totalPages: Math.ceil(totalTickets / limit),
            currentPage: page,
            tickets: allTickets
        });    

    } catch (error) {
        next(error)
    }
}




const changeTicketStatus = async (req , res , next) => {

    try {
        
        const {ticketId} = req.params
        const {newTicketStatus} = req.body

        const ticket = await Ticket.findById(ticketId)

        if(!ticket){
            return next(createError(`Ticket with this id not exist ${ticketId}` , 404))
        }

        const validTicketStatus = ["pending" , "inProgress" , "closed"]

        
        if(!newTicketStatus){
            return next(createError(`you must provide a new ticket status` , 400))
        }

        if(!validTicketStatus.includes(newTicketStatus)){
            return next(createError(`${newTicketStatus} is not a valid ticket status` , 400))
        }


        ticket.status = newTicketStatus

        await ticket.save()
        
        res.status(200).json(ticket)

    } catch (error) {
        next(error)
    }
}




const supportTeamResponse = async (req , res , next) => {

    try {

        const {ticketId} = req.params
        const {supportText} = req.body

        const ticket = await Ticket.findById(ticketId)

        if(!ticket){
            return next(createError(`Ticket with this id not exist ${ticketId}` , 404))
        }
        
        if(!supportText){
            return next(createError(`you must provide the support text` , 400))
        }

        if(supportText.length > 300){
            return next(createError(`supportText must be less than 300 char` , 400))
        }

        ticket.supportTeamResponse = supportText

        await ticket.save()
        
        res.status(200).json(ticket)

    } catch (error) {
        next(error)
    }
}




const getFilteredTickets = async (req , res , next) => {

    try {
        
        const {status , regarding , userId , page = 1} = req.query

        const limit = 10;

        const skip = (page - 1) * limit;

        let filterObj = {}

        const validTicketStatus = ["pending" , "inProgress" , "closed"]
        const validRegardingValues = ["content" , "technical"]

        if(status && validTicketStatus.includes(status)){
            filterObj.status = status
        }

        if(regarding && validRegardingValues.includes(regarding)){
            filterObj.regarding = regarding
        }

        if (userId) {
            filterObj.userObjRef = userId;
        }

        const allTickets = await Ticket.find(filterObj).skip(skip).limit(limit).populate("userObjRef");

        const totalTickets = await Ticket.countDocuments(filterObj);

        res.status(200).json({
            totalTickets,
            totalPages: Math.ceil(totalTickets / limit),
            currentPage: page,
            tickets: allTickets
        });

    } catch (error) {
        next(error)
    }
}




const deleteTicket = async (req, res, next) => {

    try {

        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return next(createError(`Ticket with ID ${ticketId} does not exist`, 404));
        }

        await Ticket.findByIdAndDelete(ticketId);

        res.status(200).json({ message: 'Ticket deleted successfully' });

    } catch (error) {
        next(error);
    }
};





const getAllInstructors = async (req , res , next) => {

    try {
        
        const page = parseInt(req.query.page) || 1;
        
        const limit = 10;

        const skip = (page - 1) * limit;

        const allInstructors  = await Instructor
            .find()
            .skip(skip)
            .limit(limit)

        const totalInstructors = await Instructor.countDocuments(allInstructors);

        res.status(200).json({
            totalInstructors,
            totalPages: Math.ceil(totalInstructors / limit),
            currentPage: page,
            allInstructors
        });

    } catch (error) {
        next(error)
    }
}




const getInstructorCourses = async (req , res , next) => {

    try {
        
          
        const page = parseInt(req.query.page) || 1;
        
        const limit = 10;

        const skip = (page - 1) * limit;

        const instructor = await Instructor.findById(req.params.instructorId)

        if (!instructor) {
            return next(createError(`instructor with ID ${req.params.instructorId} does not exist`, 404));
        }

        const instructorCourses = await Course.find({ instructorId: req.params.instructorId })
        .skip(skip)
        .limit(limit)
        .select('-sections.items.attachments')


        const totalInstructorCourses = await Course.countDocuments({ instructorId: req.params.instructorId });
        
        res.status(200).json({
            totalInstructorCourses,
            totalPages: Math.ceil(totalInstructorCourses / limit),
            currentPage: page,
            instructorCourses
        });

    } catch (error) {
        next(error)
    }
}
  




const getStudentsInCourse = async (req, res, next) => {

    try {

        const { instructorId , courseId } = req.params;

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const instructor = await Instructor.findById(instructorId);

        if (!instructor) {
            return next(createError(`Instructor with ID ${instructorId} does not exist`, 404));
        }

        const course = await Course.findOne({ _id: courseId, instructorId })
            .populate({
                path: 'studentsEnrolled',
                options: {
                    skip: skip,
                    limit: limit
                }
            });


        if (!course) {
            return next(createError(`Course with ID ${courseId} taught by instructor with ID ${instructorId} does not exist`, 404));
        }

        const totalStudentsCount = await Course.findById(courseId)
            .select('studentsEnrolled')
            .then(course => course.studentsEnrolled.length);


        res.status(200).json({
            courseId: course._id,
            courseTitle: course.title,
            totalStudents: totalStudentsCount,
            totalPages: Math.ceil(totalStudentsCount / limit),
            currentPage: page,
            students: course.studentsEnrolled
        });

    } catch (error) {
        next(error);
    }
};





const getAllCourses = async (req , res , next) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const courses = await Course.find().skip(skip).limit(limit)

        res.status(200).json({
            totalPages: Math.ceil(courses.length / limit),
            currentPage: page,
            courses
        })

    } catch (error) {
        next(error)
    }

}




const getAllUsers = async (req , res , next)=> {

    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const users = await User.find().skip(skip).limit(limit)

        res.status(200).json({
            totalPages: Math.ceil(users.length / limit),
            currentPage: page,
            users
        })

    } catch (error) {
        next(error)
    }
} 





const getCourseSections = async (req , res , next) => {

    try {
        
        const {courseId} = req.params

        const course = await Course.findById(courseId)

        if(!course){
            return next(createError("Course with this id not found" , 404))
        }

        res.status(200).json(course.sections)

    } catch (error) {
        next(error)
    }
}




const modifyCourseSection = async (req, res, next) => {

    try {

        const { courseId, sectionId } = req.params;
        const { name } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(createError("Course with this id not found", 404));
        }

        const section = course.sections.id(sectionId);

        if (!section) {
            return next(createError("Section with this id not found", 404));
        }

        if (name) {
            section.name = name;
        }

        await course.save();

        res.status(200).json(section);

    } catch (error) {
        next(error);
    }
};




const deleteCourseSection = async (req , res , next) => {

    try {
        
        const {courseId , sectionId} = req.params

        const course = await Course.findById(courseId)

        if(!course){
            return next(createError("Course with this id not found" , 404))
        }

        const isSectionExist = course.sections.find(section => section._id.toString() === sectionId)
        
        if(!isSectionExist){
            return next(createError("Section with this id not exist" , 404))
        }

        course.sections = course.sections.filter(section => section._id.toString() !== sectionId)

        await course.save()

        res.status(200).json(course.sections)

    } catch (error) {
        next(error)
    }
}




const addSectionToCourse = async (req, res, next) => {

    try {

        const { courseId } = req.params;
        const { name, items } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(createError("Course with this id not found", 404));
        }

        const validItems = items && Array.isArray(items) ? items : [];
        
        const newSection = {
            name,
            items: validItems,
            _id: new mongoose.Types.ObjectId(), 
        };

        course.sections.push(newSection);

        await course.save();

        res.status(200).json(course);

    } catch (error) {
        next(error);
    }
};





const addItemToSection = async (req, res, next) => {

    try {

        const { courseId, sectionId } = req.params;
        const { type , name , attachments } = req.body;

        if (!type || !name ) {
            return next(createError("All fields (type, name, content) are required", 400));
        }

        const validTypes =['Video', 'Image' , "Activity"];

        if (!validTypes.includes(type)) {
            return next(createError("Invalid item type", 400));
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return next(createError("Course with this id not found", 404));
        }

        const section = course.sections.id(sectionId);

        if (!section) {
            return next(createError("Section with this id not found", 404));
        }

        const newItem = {
            type,
            name,
            attachments: attachments || []
        };

        section.items.push(newItem);

        await course.save();

        res.status(200).json(course);

    } catch (error) {
        next(error);
    }
};





const removeItemFromSection = async (req, res, next) => {

    try {

        const { courseId, sectionId, itemId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(createError("Course with this id not found", 404));
        }

        const section = course.sections.find(section => section._id.toString() === sectionId);

        if (!section) {
            return next(createError("Section with this id not found", 404));
        }

        const item = section.items.find(item => item._id.toString() === itemId);

        if (!item) {
            return next(createError("Item with this id not found", 404));
        }

        await Promise.all(

            item.attachments.map(async (attachmentId) => {

                const attachment = await Attachment.findById(attachmentId);

                if (attachment) {

                    await Attachment.deleteOne({ _id: attachmentId });

                    const filePath = path.join(__dirname, '..', attachment.file_path);
                    
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }

                }

            })

        );

        section.items.pull(itemId);
        
        section.items = section.items.filter(item => item._id.toString() !== itemId);
        
        await course.save();

        res.status(200).json(section);

    } catch (error) {
        next(error);
    }
};




const modifyItemInSection = async (req, res, next) => {

    try {

        const { courseId, sectionId, itemId } = req.params;
        const { type, name, content } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(createError("Course with this id not found", 404));
        }

        const section = course.sections.id(sectionId);

        if (!section) {
            return next(createError("Section with this id not found", 404));
        }

        const item = section.items.id(itemId);

        if (!item) {
            return next(createError("Item with this id not found", 404));
        }

        if (type) {

            const validTypes = ['Video', 'image' , "Activity"];

            if (!validTypes.includes(type)) {
                return next(createError("Invalid item type", 400));
            }

            item.type = type;

        }

        if (name) {
            item.name = name;
        }

        if (content) {
            item.content = content;
        }

        await course.save();

        res.status(200).json(item);

    } catch (error) {
        next(error);
    }
};




const addAttachmentToItem = async (req, res, next) => {

    try {

        const { courseId, sectionId, itemId } = req.params;
        const { attachment_name, type } = req.body;

        const file = req.file;

        if (!file || !attachment_name || !type) {
            return next(createError("All fields (attachment_name, type, and attachment) are required", 400));
        }

        const validTypes = ['Video', 'image' , "Activity"];

        if (!validTypes.includes(type)) {
            return next(createError("Invalid attachment type", 400));
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return next(createError("Course with this id not found", 404));
        }

        const section = course.sections.find(section => section._id.toString() === sectionId);

        if (!section) {
            return next(createError("Section with this id not found", 404));
        }

        const item = section.items.find(item => item._id.toString() === itemId);

        if (!item) {
            return next(createError("Item with this id not found", 404));
        }

        const newAttachment = new Attachment({
            file_path: file.path,
            attachment_name,
            type
        });

        await newAttachment.save();

        item.attachments.push(newAttachment);

        await course.save();

        res.status(200).json(course);
    
    } catch (error) {
        next(error);
    }
};




const modifyAttachment = async (req, res, next) => {

    try {
        
        const { courseId, sectionId, itemId, attachmentId } = req.params;
        const { attachment_name, type } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(createError("Course with this id not found", 404));
        }

        const section = course.sections.id(sectionId);

        if (!section) {
            return next(createError("Section with this id not found", 404));
        }

        const item = section.items.id(itemId);

        if (!item) {
            return next(createError("Item with this id not found", 404));
        }

        const attachment = item.attachments.id(attachmentId);

        if (!attachment) {
            return next(createError("Attachment with this id not found", 404));
        }

        if (req.file) {

            const oldFilePath = attachment.file_path;
            attachment.file_path = req.file.path;

            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

        }

        if (attachment_name) {
            attachment.attachment_name = attachment_name;
        }

        if (type) {

            const validTypes = ['Video', 'image' , "Activity"];

            if (!validTypes.includes(type)) {
                return next(createError("Invalid attachment type", 400));
            }

            attachment.type = type;

        }

        await course.save();

        res.status(200).json(course);

    } catch (error) {
        next(error);
    }
};




const deleteAttachment = async (req, res, next) => {

    try {

        const { courseId, sectionId, itemId, attachmentId } = req.params;

        const courseObjectId = ObjectId.isValid(courseId) ? new ObjectId(courseId) : null;
        const sectionObjectId = ObjectId.isValid(sectionId) ? new ObjectId(sectionId) : null;
        const itemObjectId = ObjectId.isValid(itemId) ? new ObjectId(itemId) : null;
        const attachmentObjectId = ObjectId.isValid(attachmentId) ? new ObjectId(attachmentId) : null;

        const course = await Course.findById(courseObjectId);
        if (!course) {
            return next(createError("Course with this id not found", 404));
        }

        const section = course.sections.id(sectionObjectId);
        if (!section) {
            return next(createError("Section with this id not found", 404));
        }

        const item = section.items.id(itemObjectId);
        if (!item) {
            return next(createError("Item with this id not found", 404));
        }

        const attachmentIndex = item.attachments.findIndex(att => att._id.toString() === attachmentObjectId.toString());

        if (attachmentIndex === -1) {
            return next(createError("Attachment with this id not found", 404));
        }

        const attachment = item.attachments[attachmentIndex];
        const filePath = attachment.file_path;

        try {
            // Check if file exists before deleting
            if (fs.existsSync(filePath)) {
                await deleteFile(filePath);
                console.log(`Successfully deleted file: ${filePath}`);
            } else {
                console.warn(`File not found: ${filePath}`);
            }
        } catch (err) {
            console.error(`Failed to delete file ${filePath}:`, err);
            return next(createError(`Failed to delete file ${filePath}`, 500));
        }

        item.attachments.pull(attachmentObjectId);

        await course.save();

        const deletedAttachment = await Attachment.findOneAndDelete({ _id: attachmentObjectId });

        if (!deletedAttachment) {
            return next(createError("Failed to delete attachment from the database", 500));
        }

        res.status(200).json(course);

    } catch (error) {
        next(error);
    }
};





const deleteInstructor = async (req, res, next) => {

    try {

      const { instructorId } = req.params;
  
      // Validate the instructor ID format
      if (!mongoose.Types.ObjectId.isValid(instructorId)) {
        return res.status(400).json({ msg: `Invalid Instructor ID format: ${instructorId}`, success: false });
      }

  
      // Find the instructor by ID
      const instructor = await Instructor.findById(instructorId);

      if (!instructor) {
        return res.status(404).json({ msg: `Instructor with this id not found: ${instructorId}`, success: false });
      }
  

      // Find all courses associated with the instructor
      let instructorCourses = await Course.find({ instructorId: instructor._id });
  

      // Update each course to reset the instructorId to null
      await Promise.all(instructorCourses.map(async (instructorCourse) => {

          try {

            const updatedCourse = await Course.findByIdAndUpdate(
              instructorCourse._id,
              { instructorId: null },
              { new: true }
            );

            return updatedCourse;

          } catch (updateError) {
            next(updateError)
          }
        
        })
      
    );
  
    
      // delete the ref user obj doc obj
      await User.deleteOne({ _id: instructor.userObjRef });

      // Delete the instructor
      await Instructor.deleteOne({ _id: instructorId });
  
      res.status(200).json({ msg: "Instructor deleted successfully", success: true });

    } catch (error) {
      next(error);
    }
  };
  




const modifyInstructor = async (req , res , next) => {

    try {
        
        const {name , email , password} = req.body

        const {instructorId} = req.params

        const instructor = await Instructor.findById(instructorId)
        const userRefObj = await User.findById(instructor.userObjRef).select("+password")

        if(!instructor){
            return next(createError("Instructor with this id not found" , 404))
        }

        if(name){
            instructor.name = name 
            userRefObj.name = name
        }

        if(email){
            instructor.email = email 
            userRefObj.email = email 
        }
        
        if(password){
            userRefObj.password = await bcrypt.hash(password , 10)
        }

        await instructor.save()
        await userRefObj.save()
        
        res.status(200).json(instructor)

    } catch (error) {
        next(error)
    }
}




const shareCourseOwner = async (req  , res , next) => {

    try {
        
        const {instructorId , courseId} = req.params
        const {newSharedOwnerId} = req.body

        const instructor = await Instructor.findById(instructorId)
        const newSharedInstructor = await Instructor.findById(newSharedOwnerId)
        const course = await Course.findById(courseId)
  
        if(!course){
            return next(createError("course with this id not found" , 404))
        }

        if(req.user.role !== "instructor" && req.user.role !== "admin"){
            return next(createError("You don't have access to share course ownership", 401));
        }

        if(instructor && course.instructorId.toString() !== instructor._id.toString()){
            return next(createError("You don't have access to share course ownership", 401));
        }

        const isCourseAlreadyShared = newSharedInstructor.coursesTeaching.includes(courseId)

        if(isCourseAlreadyShared){
            return next(createError("You already shared this course ownership with this instructor", 400));
        }

        newSharedInstructor.coursesTeaching.push(courseId)

        await newSharedInstructor.save()

        res.status(200).json(newSharedInstructor)

    } catch (error) {
        next(error)
    }
}

 


// const deleteCourse = async (req, res, next) => {

//     try {

//         const { courseId } = req.params;
//         const course = await Course.findById(courseId);
        
//         if (!course) {
//             return next(createError('Course not found', 404));
//         }

//         if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//             return next(createError('You do not have permission to delete this course', 403));
//         }

//         for (const section of course.sections) {

//             for (const item of section.items) {

//                 for (const attachmentId of item.attachments) {

//                     const attachment = await Attachment.findById(attachmentId);

//                     if (attachment) {

//                         const filePath = path.resolve(attachment.file_path);

//                         fs.unlink(filePath, (err) => {
//                             if (err) {
//                                 next(createError("Error deleting file" , 400))
//                             }
//                         });

//                         await Attachment.findByIdAndDelete(attachmentId)

//                     }
//                 }
//             }
//         }

//         const instructor = await Instructor.findById(course.instructorId)

//         instructor.coursesTeaching = instructor.coursesTeaching.filter(courseId => courseId.toString() !== course._id.toString())

//         await instructor.save()

//         await Course.findByIdAndDelete(courseId);

//         res.status(200).json({ message: 'Course and associated attachments deleted successfully' });
    
//     } catch (error) {
//         next(error);
//     }
// };








const deleteCourse = async (req, res, next) => {

    try {

        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        
        if (!course) {
            return next(createError('Course not found', 404));
        }

        if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return next(createError('You do not have permission to delete this course', 403));
        }

        // Aggregate all attachment IDs related to the course
        const attachmentIds = await Course.aggregate([
            { $match: { _id: course._id } },
            { $unwind: "$sections" },
            { $unwind: "$sections.items" },
            { $unwind: "$sections.items.attachments" },
            { $group: { _id: null, attachmentIds: { $push: "$sections.items.attachments" } } },
            { $project: { _id: 0, attachmentIds: 1 } }
        ]);

        if (attachmentIds.length > 0) {

            const ids = attachmentIds[0].attachmentIds;

            const attachments = await Attachment.find({ _id: { $in: ids } });

            for (const attachment of attachments) {

                const filePath = path.resolve(attachment.file_path);

                fs.unlink(filePath, (err) => {
                    if (err) {
                        return next(createError("Error deleting file", 400));
                    }
                });

            }

            await Attachment.deleteMany({ _id: { $in: ids } });
        }

        const instructor = await Instructor.findById(course.instructorId);
        
        instructor.coursesTeaching = instructor.coursesTeaching.filter(courseId => courseId.toString() !== course._id.toString());

        await instructor.save();

        await Course.findByIdAndDelete(courseId);

        res.status(200).json({ message: 'Course and associated attachments deleted successfully' });

    } catch (error) {
        next(error);
    }
};





const getFilteredCourses = async (req , res , next) => {

    try {
        
        const {
            instructorId,
            noInstructor,
            startDate,
            endDate,
            title,
            minRate,
            maxRate ,
            page = 1,
            limit = 10
          } = req.query;
      
          let filter = {};
      
          // Filter by instructor ID
          if (instructorId) {
            filter.instructorId = instructorId;
          }
      
          // Filter by courses with no instructor
          if (noInstructor === 'true') {
            filter.instructorId = null;
          }
      
          // Filter by start date and/or end date
          if (startDate || endDate) {

            filter.$or = [];

            if (startDate) {
              filter.$or.push({ startDate: { $gte: new Date(startDate) } });
            }

            if (endDate) {
              filter.$or.push({ endDate: { $lte: new Date(endDate) } });
            }

          }
      

          // Filter by title (case-insensitive, partial match)
          if (title) {
            filter.title = { $regex: title , $options: 'i' };
          }
      

          // Filter by rate range
          if (minRate || maxRate) {

            filter.rate = {};

            if (minRate) {
              filter.rate.$gte = parseFloat(minRate);
            }

            if (maxRate) {
              filter.rate.$lte = parseFloat(maxRate);
            }

          }
      
          // Execute the query with the built filter
          const skip = (page - 1) * limit;

          // Execute the query with the built filter and pagination
          const courses = await Course.find(filter).skip(skip).limit(parseInt(limit)).select("-sections.items.attachments");
      
          // Get total count for pagination
          const totalCourses = await Course.countDocuments(filter);

          const totalPages = Math.ceil(totalCourses / limit);

            res.status(200).json({
            success: true,
            data: courses,
            pagination: {
                totalCourses,
                totalPages,
                currentPage: parseInt(page),
                limit: parseInt(limit)
                }
            });

    } catch (error) {
        next(error)
    }

}





const assignCourseToAdmin = async (req , res , next) => {

    try {
        
        const {courseId} = req.params

        const course = await Course.findById(courseId) 

        if(!course){
            return next(createError("course not found" , 404))
        }

        if(course.instructorId !== null){
            return next(createError("course already owned by instructor" , 400))
        }

        const isAdminAlreadyInstructor = await Instructor.findOne({userObjRef : req.user._id})

        if(isAdminAlreadyInstructor){

            isAdminAlreadyInstructor.coursesTeaching.push(course._id)
            
            const updatedCourse = await Course.findByIdAndUpdate(courseId , {instructorId : isAdminAlreadyInstructor._id} , {new : true})

            await isAdminAlreadyInstructor.save()
            
            res.status(200).json({isAdminAlreadyInstructor , updatedCourse})        
        
        }else{

            const newInstructorAsAdmin = new Instructor({
                name : req.user.name ,
                email : req.user.email ,
                userObjRef : req.user._id 
            })

            newInstructorAsAdmin.coursesTeaching.push(course._id)
            
            const updatedCourse = await Course.findByIdAndUpdate(courseId , {instructorId : newInstructorAsAdmin._id} , {new : true})

            await newInstructorAsAdmin.save()
            
            res.status(201).json({newInstructorAsAdmin , updatedCourse})
            
        }

    } catch (error) {
        next(error)
    }

}





const updateEnrolmentStatus = async (req , res , next) => {

    try {
        
        const {courseId , studentId} = req.params
        const {newStatus} = req.body

        const course = await Course.findById(courseId)

        if(!course){
            return next(createError("course not found" , 404))
        }

        const studentReqEnrolment = await CourseEnrolRequestModel.findOne({courseId : course._id , studentId})

        if(!studentReqEnrolment){
            return next(createError("student with this id doesn't request enrolment for this course" , 404))
        }

        const validStatusTypes = ["pending" , "approved" , "rejected"]

        if(!validStatusTypes.includes(newStatus)){
            return next(createError("Invalid course request status type" , 400))
        }

        const updatedStudentReqEnrolment = await CourseEnrolRequestModel.findByIdAndUpdate(studentReqEnrolment._id , {status : newStatus} , {new : true})
        
        if(newStatus === "approved"){
            // operator structure : {$operator : {db_key : value}}
            await Student.findByIdAndUpdate(studentId , {$push : {coursesEnrolled : course._id}} , {new : true})
            await Course.findByIdAndUpdate(courseId , {$push : {studentsEnrolled : studentId}} , {new : true})
            return res.status(200).json(updatedStudentReqEnrolment)
        }

        // to remove the course enrollment for this student if he was already approved before and the new status is rejected
        if(studentReqEnrolment.status === "approved" && newStatus === "rejected"){
            await Student.findByIdAndUpdate(studentId , {$pull : {coursesEnrolled : course._id}} , {new : true})
            await Course.findByIdAndUpdate(courseId , {$pull : {studentsEnrolled : studentId}} , {new : true})
            return res.status(200).json(updatedStudentReqEnrolment)
        }   

        res.status(200).json(updatedStudentReqEnrolment)

    } catch (error) {
        next(error)
    }

}




const getAllEnrolmentsRequestsForAdmin = async (req, res, next) => {

    try {

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const allEnrolmentRequests = await CourseEnrolRequestModel.find()
        .skip(skip)
        .limit(limit)
        .populate("courseId", "title")
        .populate("studentId", "name");
  
      const totalEnrolments = await CourseEnrolRequestModel.countDocuments();
  
      res.status(200).json({
        totalEnrolments,
        totalPages: Math.ceil(totalEnrolments / limit),
        currentPage: page,
        enrolments: allEnrolmentRequests,
      });
      
    } catch (error) {
      next(error);
    }
  };




module.exports = {
    getAllTickets,
    changeTicketStatus,
    supportTeamResponse,
    getFilteredTickets,
    deleteTicket,
    getAllInstructors,
    getInstructorCourses,
    getStudentsInCourse,
    getAllCourses,
    getAllUsers,
    getCourseSections,
    deleteCourseSection,
    addSectionToCourse,
    removeItemFromSection,
    addAttachmentToItem,
    modifyAttachment,
    deleteAttachment,
    addItemToSection,
    modifyItemInSection,
    modifyCourseSection,
    deleteInstructor,
    modifyInstructor,
    shareCourseOwner,
    deleteCourse ,
    getFilteredCourses ,
    assignCourseToAdmin ,
    updateEnrolmentStatus ,
    getAllEnrolmentsRequestsForAdmin
}