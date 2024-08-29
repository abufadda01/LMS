const {Router} = require("express")

const {protectRoutes , adminAuth} = require("../middlewares/auth")
const {postTracking , getUserTrackings , deleteTrack , getUserTrackActivity} = require("../controllers/trackingControllers")

const router = Router()


router.post("/:attachmentId" , protectRoutes , postTracking)

router.get("/" , protectRoutes , getUserTrackings)

router.get("/:userId/:attachmentId" , protectRoutes , getUserTrackActivity)

router.delete("/:trackId" , protectRoutes , adminAuth , deleteTrack)



module.exports = router