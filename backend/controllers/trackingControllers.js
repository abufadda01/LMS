const createError = require("../utils/createError");
const Tracking = require("../models/trackingModel");
const { Attachment } = require("../models/attachmentModel");




const postTracking = async (req , res , next) => {

    try {
        
        const {attachmentId} = req.params
        const {questions , endingTime , startingTime} = req.body

        const activity = await Attachment.findById(attachmentId)
        const userActivityTrack = await Tracking.findOne({ activityId: activity._id , trackedUser: req.user._id })

        if(Number(userActivityTrack.attempts) === Number(activity.maxAttempts)){
            return next(createError("Max attempts has reached for this activity" , 400));
        }

        if (!activity) {
            return next(createError("Attachment not found" , 400))
        }

        const questionsBases = activity.questions.reduce((prev, ques) => {
            const { _id, question, correctAnswer, questionType, choices, mark } = ques.toObject();
            return { ...prev, [_id]: { _id , question , correctAnswer , questionType , choices , mark } };
        }, {});

        let totalScore = 0

        const correctedQuestions = questions.map((question) => {

            const questionBase = questionsBases[question._id]

            const isCorrect = question.userAnswer === questionBase.correctAnswer

            if(isCorrect){
                totalScore += question.mark
            }

            return{
                ...question ,
                isCorrect: isCorrect ? "correct" : "inCorrect",
                correctAnswer: questionBase.correctAnswer,
            }

        })


        const isPassed = totalScore >= activity.passScore

        const spentTime = endingTime !== 0 
            ? (new Date(endingTime).getTime() - new Date(startingTime).getTime()) / 60000 
            : 0 ;


        if(userActivityTrack){

            userActivityTrack.score = activity.score
            userActivityTrack.userScore = totalScore
            userActivityTrack.passed = isPassed ? true : false
            userActivityTrack.completed = isPassed || userActivityTrack.attempts === activity.maxAttempts ? true : false
            userActivityTrack.questions = correctedQuestions ? correctedQuestions : []
            userActivityTrack.spentTime = spentTime
            userActivityTrack.startingTime = startingTime
            userActivityTrack.endingTime = endingTime
                        
            if(req.user.role !== "instructor" && req.user.role !== "admin"){
                userActivityTrack.attempts = Number(userActivityTrack.attempts + 1)
            }
            
            await userActivityTrack.save()

            return res.status(200).json(userActivityTrack)

        }else{

            const tracking = await Tracking({
                activityId: req.body.activityId,
                score: activity.score,
                passed: isPassed ? "passed" : "failed",
                completed: isPassed || userActivityTrack.attempts === activity.maxAttempts ? "completed" : "not completed",
                questions: correctedQuestions,
                spentTime,
                userScore : totalScore ,
                startingTime: req.body.startingTime,
                endingTime: req.body.endingTime,
                attempts : 1
              });
            
              await tracking.save()

              activity.trackingInfo.push(tracking)

              await activity.save()
              
              return res.status(200).json({tracking , activity})

        }   

    } catch (error) {
        next(error)
    }

}





const getUserTrackings = async (req , res , next) => {

    try {

        const {page , passStatus , userId , markRange , completed} = req.query

        const limit = 10
        const skip = (page - 1) * limit;
        
        let filterObj = {}

        const validTrackingPassedStatus = ["passed" , "not-passed"]
        const validMarkRangeStatus = ["less-than-50" , "above-50"]

        if(passStatus && validTrackingPassedStatus.includes(passStatus)){
            filterObj.passed = passStatus === "passed" ? true : false
        }

        if(userId){
            filterObj.trackedUser = userId
        }

        if (markRange === 'less-than-50' && validMarkRangeStatus.includes(markRange)) {
            filterObj.userScore = { $lt: 50 }
        } else if (markRange === 'above-50' && validMarkRangeStatus.includes(markRange)) {
            filterObj.userScore = { $gte: 50 }
        }

        if (completed) {
            filterObj.completed = completed === 'true';
        }


        const userTrackings = await Tracking.find(filterObj).skip(skip).limit(limit);

        const totalTrackings = await Tracking.countDocuments(filterObj);

        const totalPages = Math.ceil(totalTrackings / limit);

        res.status(200).json({
            totalPages,
            currentPage: parseInt(page),
            userTrackings
        });

    } catch (error) {
        next(error)        
    }

}





const deleteTrack = async (req , res , next) => {

    try {
        
        const track = await Tracking.findById(req.params.trackId)

        if (!track) {
            return res.status(404).send("Attachment not found");
        }

        const activity = await Attachment.findById(track.activityId)

        activity.trackingInfo = activity.trackingInfo.filter(tra => tra._id.toString() !== track._id.toString())

        await activity.save()

        await Tracking.deleteOne({_id : track._id})

        res.status(200).json(activity)

    } catch (error) {
        next(error)
    }
}





const getUserTrackActivity = async (req , res , next) => {
    try {
        const {attachmentId , userId} = req.params
        const track = await Tracking.findOne({trackedUser : userId , activityId : attachmentId})
        res.status(200).json(track)
    } catch (error) {
        next(error)
    }
}




module.exports = {postTracking , getUserTrackings , deleteTrack , getUserTrackActivity}