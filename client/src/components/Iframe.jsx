import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import axios from "axios";
import { useSelector } from "react-redux";
import PopUp from "./PopUp";

// const trackingInitialData = {
//     score: 0,
//     passed: false,
//     completed: false,
//     questions: [],
//     spentTime: 0,
//     startingTime: 0,
//     endingTime: 0,
//     attempts: 0,
//     activityId: "",
// };




const Iframe = ({src , activityObj, setShowIframe, showIframe }) => {
    
//     const [file, setFile] = useState(null);
//     const [activity, setActivity] = useState({});
//     const [iframeSrc, setIframeSrc] = useState("");
//     const [updatedTracking, setUpdatedTracking] = useState({ ...trackingInitialData });
//     const [trackObj, setTrackObj] = useState({});
//     const [message, setMessage] = useState({});

//     const [openPopUp , setOpenPopUp] = useState(false)

//     const userSlice = useSelector((state) => state.user);
//     const { user, token } = userSlice;


//     useEffect(() => {
//         setActivity(activityObj);
//     }, [activityObj]);



//     useEffect(() => {

//         if (showIframe && activityObj) {
//             checkAndDownloadFile();
//         } else {
//             resetIframe();
//         }

//     }, [activityObj, showIframe]);


//     const resetIframe = () => {
//         setIframeSrc(""); 
//     };


//     useEffect(() => {
//         if (showIframe && activityObj) {
//             getUserTrackForActivity();
//         }
//     }, [activityObj, showIframe]);

//     console.log(activityObj)


//     useEffect(() => {
//         if (showIframe && activityObj) {
//             checkAndDownloadFile();
//         }
//     }, [activityObj]);



//     const getUserTrackForActivity = async () => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/tracking/${user?._id}/${activityObj?._id}`, {
//                 headers: {
//                     "Authorization": `Bearer ${token}`
//                 }
//             });
//             setTrackObj(response.data);
//         } catch (error) {
//             console.log(error);
//         }
//     };



//     const checkAndDownloadFile = async () => {

//         if (activityObj?.maxAttempts === trackObj.attempts) {

//             window.alert("Max attempts have been reached");
//             setIframeSrc("");
//             setShowIframe(false)
//             return;

//         }

//         await downloadAndProcessZipFile();

//     };



//     const downloadAndProcessZipFile = async () => {


//         try {

//             const downloadUrl = `http://localhost:5000/api/attachment/download/${activityObj?._id}`;

//             const response = await axios.get(downloadUrl, {
//                 responseType: "arraybuffer",
//                 headers: {
//                     "Authorization": `Bearer ${token}`
//                 }
//             });

//             const zip = new JSZip();
//             const content = await zip.loadAsync(response.data);

//             const htmlFile = Object.keys(content.files).find((filename) => filename.endsWith(".html"));

//             if (htmlFile) {

//                 const htmlContent = await zip.file(htmlFile).async("string");
//                 const blobUrl = URL.createObjectURL(new Blob([htmlContent], { type: "text/html" }));

//                 setIframeSrc(blobUrl);

//                 setUpdatedTracking({
//                     ...updatedTracking,
//                     questions: activityObj?.questions,
//                     activityId: activityObj?._id,
//                     startingTime: Date.now(),
//                 });

//             } else {
//                 console.error("No HTML file found in the ZIP archive.");
//             }

//         } catch (error) {

//             if (error.response && error.response.data) {
//                 console.error("Error:", error.response.data.msg);
//             } else {
//                 console.error("An unexpected error occurred:", error.message);
//             }

//         }

//     };

//     console.log(openPopUp)

//     const trackingEventHandler = async (e) => {

//         const { type , payload } = e.data;

//         if (!activityObj) return;

//         let requestObject = { ...updatedTracking };

//         switch (type) {

//             case "START_ACTIVITY":

//                 requestObject = { ...updatedTracking, ...payload };
//                 break;

//             case "SUBMIT_ACTIVITY":

//                 const updatedQuestions = updatedTracking?.questions?.map((question) => {

//                     const foundQuestion = payload?.questions?.find((q) => q?.question === question?.question);

//                     if (foundQuestion) {
//                         return {
//                             ...question,
//                             userAnswer: foundQuestion.userAnswer,
//                         };
//                     }

//                     return question;

//                 });

//                 requestObject = {
//                     ...updatedTracking,
//                     questions: updatedQuestions,
//                     endingTime: Date.now(),
//                     startingTime: updatedTracking.startingTime,
//                 };

//                 try {

//                     const response = await axios.post(`http://localhost:5000/api/tracking/${activityObj?._id}`, requestObject, {
//                         headers: {
//                             "Authorization": `Bearer ${token}`
//                         }
//                     });

//                     setUpdatedTracking(response.data);

//                     console.log(response.status)

//                     if(response.status === 200){

//                         setOpenPopUp(true)
                        
//                         const message = {
//                             userScore : response.data.userScore,
//                             passed : response.data.passed ,
//                             spentTime : parseFloat(response.data.spentTime.toFixed(2))
//                         }

//                         setMessage(message)

//                     }

//                     // alert(`Activity submitted successfully. Your score: ${response.data.userScore}`);
//                     // alert(`You: ${response.data.passed ? "passed" : "failed"} this exam`);
//                     // alert(`Time spent: ${parseFloat(response.data.spentTime.toFixed(2))}`);

//                     setShowIframe(false)

//                 } catch (error) {
//                     console.error('Error updating tracking:', error);
//                 }

//                 break;

//             default:
//                 return;

//         }

//     };




//     useEffect(() => {
//         window.addEventListener("message", trackingEventHandler);

//         return () => window.removeEventListener("message", trackingEventHandler);
    
//     }, [activityObj, updatedTracking]);




    return (
        <div>

            <iframe src={src} style={{width: "80%", height: "550px", border: "1px solid #ccc", marginBottom: "20px" , margin : "30px" }} title="Activity Frame" />

        </div> 
    );
};


export default Iframe;
