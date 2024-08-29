const express = require("express");

const {protectRoutes} = require("../middlewares/auth")

const {
    getAllCourses , 
    getCourseById,
    courseEnrollment
} = require("../controllers/courseControllers")


const router = express.Router();


router.get("/" , protectRoutes , getAllCourses)

router.get("/:courseId" , protectRoutes , getCourseById)

router.post("/:courseId" , protectRoutes , courseEnrollment)



module.exports = router;
