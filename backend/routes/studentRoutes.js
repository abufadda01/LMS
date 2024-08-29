const {Router} = require("express")


const {protectRoutes , adminAuth} = require("../middlewares/auth")

const { getAllStudentCourses, courseEnrolRequest , getMyEnrolmentRequests, checkEnrollmentStatus} = require("../controllers/studentControllers.js")


const router = Router()


router.get("/" , protectRoutes , getAllStudentCourses)


router.post("/enroll", protectRoutes, courseEnrolRequest);

router.get("/enrolment-requests", protectRoutes, getMyEnrolmentRequests);

router.get("/check-enrollment/:courseId", protectRoutes, checkEnrollmentStatus);



module.exports = router