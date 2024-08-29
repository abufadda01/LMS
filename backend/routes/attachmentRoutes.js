const express = require("express");

const {protectRoutes} = require("../middlewares/auth")

const {
    startActivity , 
    getActivity , 
    deleteAttachment , 
    postActivity
} = require("../controllers/attachmentControllers")

const router = express.Router();


router.get("/:attachmentId" , protectRoutes , getActivity);

router.post("/:courseId/:sectionId/:itemId" , protectRoutes , postActivity);

router.get("/download/:attachmentId" , protectRoutes , startActivity);

router.delete("/:courseId/:sectionId/:itemId/:attachmentId" , protectRoutes , deleteAttachment);



module.exports = router;
