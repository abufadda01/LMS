const Tracking = require("../models/trackingModel");

const createError = require("../utils/createError")

const mongoose = require("mongoose");

const Course = require("../models/courseModel");
const { Attachment } = require("../models/attachmentModel");

const path = require("path")
const fs = require("fs")
const cheerio = require("cheerio");
const AdmZip = require("adm-zip");

const PUBLIC_PATH = process.env.PUBLIC_PATH




const getActivity = async (req , res , next) => {

    try {
        
        const attachment = await Attachment.findById(req.params.attachmentId)
        
        if(!attachment){
            return next(createError("Activity with this id not exist" , 404))
        }

        res.status(200).json(attachment);
    
    } catch (error) {
        next(error)
    }
    
}






const postActivity = async (req , res , next) => {

  const { courseId, sectionId, itemId } = req.params;

  if (!req.files || !req.files.activityFile) {
    return next(createError("No files were uploaded" , 400));
  }

  console.log(req.user)

  if(req.user.role !== "instructor" && req.user.role !== "admin"){
    return next(createError("Instructors , admins only can add attachments" , 401))
  }

  const activityFile = req.files.activityFile;
  const fileName = `activity-${Date.now()}-${activityFile.name}`;
  const filePath = path.join(PUBLIC_PATH, fileName);

  try {

    await activityFile.mv(filePath);

    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(htmlContent);

    const scriptContent = $("script").html();

    if (!scriptContent) {
      return next(createError("No script content found in HTML file." , 400))
    }

    const questionsRegex = /const questions = \[([\s\S]*?)];/;
    const typeRegex = /const type = "(.*?)"/;
    const maxAttemptsRegex = /const maxAttempts\s*=\s*(\d+)/;
    const scoreRegex = /const score\s*=\s*(\d+)/;
    const passScoreRegex = /const passScore\s*=\s*(\d+)/;

    const typeMatch = scriptContent.match(typeRegex);
    const maxAttemptsMatch = scriptContent.match(maxAttemptsRegex);
    const scoreMatch = scriptContent.match(scoreRegex);
    const passScoreMatch = scriptContent.match(passScoreRegex);
    const questionsMatch = scriptContent.match(questionsRegex);

    if (!typeMatch || !maxAttemptsMatch || !scoreMatch) {
      return next(createError("Variable extraction failed." , 400));
    }

    const type = typeMatch[1];
    const maxAttempts = Number(maxAttemptsMatch[1]);
    const score = Number(scoreMatch[1]);
    const passScore = Number(passScoreMatch[1]);

    let questions = [];

    if (type === "Activity") {

      if (!questionsMatch) {
        return next(createError("Questions not found in the HTML file." , 400));
      }

      let questionsArrayString = questionsMatch[1].trim();


      // Ensure valid JSON by removing trailing commas
      // questionsArrayString = questionsArrayString.replace(/,\s*([\]}])/g, '$1');

      questionsArrayString = `[${questionsArrayString.replace(/,\s*$/, '')}]`;

      try {
        questions = JSON.parse(questionsArrayString);
      } catch (error) {
        return next(createError("Error parsing questions array." , 400));
      }

    }

    const validTypes = ['Video', 'Image', 'Activity']; 

    if (!validTypes.includes(type)) {
      return next(createError("Invalid attachment type", 400));
    }

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

    if (item.attachments.length > 0) {
      return next(createError("You can add only one attachment for each item", 400));
    }

    const zip = new AdmZip();
    zip.addLocalFile(filePath);

    const zipFileName = `${fileName}.zip`;
    const zipFilePath = path.join(PUBLIC_PATH, zipFileName);
    zip.writeZip(zipFilePath);

    fs.unlinkSync(filePath);

    const activity = new Attachment({
      type,
      score,
      passScore,
      questions,
      maxAttempts,
      file_path: zipFilePath,
      activityFileName: zipFileName,
    });

    await activity.save();

    item.attachments.push(activity);

    await course.save();

    res.status(200).json(course);

  } catch (error) {
    next(error)
  }

}





const startActivity = async (req, res, next) => {

    try {
        
        const activity = await Attachment.findById(req.params.attachmentId);

        if (!activity) {
            return res.status(404).send("Attachment not found");
        }

        const filePath = path.resolve(activity.file_path);

        if (!fs.existsSync(filePath)) {
            return next(createError("File not found" , 404));
        }

        const userActivityTrack = await Tracking.findOne({ activityId: activity._id , trackedUser: req.user._id })

        if(userActivityTrack){
            
            if(Number(userActivityTrack.attempts) === Number(activity.maxAttempts)){
                return next(createError("Max attempts has reached for this activity" , 400));
            }
            
            userActivityTrack.startingTime = Date.now()

            await userActivityTrack.save()
        
        }else{

            // initial tracking doc obj for the activity
            const newTrack = new Tracking({
                activityId: activity._id,
                trackedUser : req.user._id,
                score : activity.score,
                passScore : activity.passScore,
                questions : activity.questions,
                startingTime : Date.now()
            })

            await newTrack.save()

            activity.trackingInfo.push(newTrack)
            
            await activity.save()

        }

        res.sendFile(filePath, (err) => {
          
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).send("Error sending file");
            }
            
        });

    } catch (error) {
        next(error);
    }
};






const deleteAttachment = async (req , res , next) => {

    try {
        
        const {courseId , itemId , sectionId} = req.params

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
        
        item.attachments = []

        await course.save()

        const attachment = await Attachment.findById(req.params.attachmentId);

        if (!attachment) {
            return res.status(404).send("Attachment not found");
        }

        const filePath = path.resolve(attachment.file_path);

        fs.unlink(filePath, async (err) => {

            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ message: 'Error deleting file' });
            }

            await Attachment.findByIdAndDelete(req.params.attachmentId)

            res.status(200).json({ message: 'attachment deleted successfully' });

        });


    } catch (error) {
        next(error)
    }
}










module.exports = {
    getActivity,
    postActivity,
    startActivity,
    deleteAttachment,
  };
  