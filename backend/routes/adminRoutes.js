const express = require("express")

const { protectRoutes , adminAuth} = require("../middlewares/auth")

const upload = require("../middlewares/multer")

const {
    getAllTickets ,
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
    deleteCourse,
    getFilteredCourses,
    assignCourseToAdmin,
    updateEnrolmentStatus,
    getAllEnrolmentsRequestsForAdmin
} = require("../controllers/adminControllers")


const router = express.Router()



router.get("/tickets" , protectRoutes , adminAuth , getAllTickets)

router.patch("/tickets/:ticketId" , protectRoutes , adminAuth , changeTicketStatus)

router.post("/tickets/:ticketId/support" , protectRoutes , adminAuth , supportTeamResponse)

router.get("/tickets/filtered" , protectRoutes , adminAuth , getFilteredTickets)

router.delete("/tickets/:ticketId", protectRoutes, adminAuth , deleteTicket);





router.get("/instructor" , protectRoutes , adminAuth , getAllInstructors)

router.get("/instructor/:instructorId/courses" , protectRoutes , adminAuth , getInstructorCourses)

router.get("/instructor/:instructorId/courses/:courseId" , protectRoutes , adminAuth , getStudentsInCourse)

router.delete("/instructor/:instructorId" , protectRoutes , adminAuth , deleteInstructor)

router.patch("/instructor/:instructorId" , protectRoutes , adminAuth , modifyInstructor)

router.patch("/instructor/owner/:instructorId/:courseId" , protectRoutes , shareCourseOwner)



router.get("/courses" , protectRoutes , adminAuth , getAllCourses)

router.get("/users" , protectRoutes , adminAuth , getAllUsers)



router.get("/get-course-sections/:courseId" , protectRoutes , getCourseSections)

router.post("/add-course-section/:courseId" , protectRoutes , addSectionToCourse)

router.patch("/modify-course-section/:courseId/:sectionId", protectRoutes, adminAuth, modifyCourseSection);

router.delete("/delete-course-section/:courseId/:sectionId" , protectRoutes , adminAuth , deleteCourseSection)





router.post('/courses/:courseId/sections/:sectionId/items', protectRoutes  , addItemToSection);

router.put('/courses/:courseId/sections/:sectionId/items/:itemId', protectRoutes , adminAuth , modifyItemInSection);

router.delete('/courses/:courseId/sections/:sectionId/items/:itemId', protectRoutes , adminAuth ,  removeItemFromSection);



router.post('/courses/:courseId/sections/:sectionId/items/:itemId/attachments', protectRoutes , upload.single("attachment") , addAttachmentToItem);

router.put('/courses/:courseId/sections/:sectionId/items/:itemId/attachments/:attachmentId', protectRoutes  , upload.single("attachment") , modifyAttachment);
 
router.delete('/courses/:courseId/sections/:sectionId/items/:itemId/attachments/:attachmentId', protectRoutes  , deleteAttachment);



router.delete('/courses/:courseId', protectRoutes , deleteCourse);

router.get("/courses/filtered" , protectRoutes , adminAuth , getFilteredCourses)

router.patch("/courses/assign/:courseId" , protectRoutes , adminAuth , assignCourseToAdmin)



router.patch("/student/update-enrolment-status/:courseId/:studentId" , protectRoutes , adminAuth , updateEnrolmentStatus)

router.get("/student/all-enrolments" , protectRoutes , adminAuth , getAllEnrolmentsRequestsForAdmin)




module.exports = router   