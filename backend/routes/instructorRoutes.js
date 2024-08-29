const {Router} = require("express")

const {protectRoutes} = require("../middlewares/auth")

const {
    getAllInstructors ,
    getAllInstructorCourses ,
    createCourse,
    deleteCourse,
    viewCourseStudents,
    getCourseById,
    updateCourseSections,
    deleteCourseSection,
    deleteCourseItem
} = require("../controllers/instructorControllers")


const router = Router()


router.get("/" , protectRoutes , getAllInstructors)

router.get("/all-instructor-courses" , protectRoutes , getAllInstructorCourses)

router.post("/create-course" , protectRoutes , createCourse)

router.get("/view-students/:courseId" , protectRoutes , viewCourseStudents)

router.delete("/delete-course/:courseId" , protectRoutes , deleteCourse)

router.get("/get-course/:courseId" , protectRoutes , getCourseById)

router.put("/update-course-sections/:courseId" , protectRoutes , updateCourseSections)

router.put("/delete-course-sections/:courseId/:sectionId" , protectRoutes , deleteCourseSection)

router.put("/delete-course-item/:courseId/:sectionId/:itemId" , protectRoutes , deleteCourseItem)

    
module.exports = router