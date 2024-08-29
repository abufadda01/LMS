import React, { useEffect, useState } from 'react';
import JSZip from 'jszip';
import axios from 'axios';
import { useParams , useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PopUp from '../../../components/PopUp';
import "./course-main-page.css";
import {axiosObj} from "../../../utils/axios"
import Iframe from '../../../components/Iframe';


const trackingInitialData = {
    score: 0,
    passed: false,
    completed: false,
    questions: [],
    spentTime: 0,
    startingTime: 0,
    endingTime: 0,
    attempts: 0,
    activityId: "",
};



const CourseMainPage = () => {

    const params = useParams();
    const navigate = useNavigate()

    const courseId = params.courseId;
    
    const { token, user } = useSelector((state) => state.user);

    const [course, setCourse] = useState(null);
    const [attachment, setAttachment] = useState({});
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState([]);
    const [showIframe, setShowIframe] = useState(false);
    const [iframeSrc, setIframeSrc] = useState("");
    const [updatedTracking, setUpdatedTracking] = useState({ ...trackingInitialData });
    const [trackObj, setTrackObj] = useState({});
    const [message, setMessage] = useState({});
    const [openPopUp, setOpenPopUp] = useState(false);




    useEffect(() => {

        const fetchCourse = async () => {

            try {
                const response = await axiosObj.get(`/instructor/get-course/${courseId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                setCourse(response.data);

            } catch (err) {
                setError('Failed to fetch course data');
            }
        };

        fetchCourse();

    }, [courseId, token]);




    useEffect(() => {

        if (showIframe && attachment) {
            checkAndDownloadFile();
        } else {
            resetIframe();
        }

    }, [attachment, showIframe]);



    const resetIframe = () => {
        setIframeSrc("");
    };



    useEffect(() => {
        if (showIframe && attachment) {
            getUserTrackForActivity();
        }
    }, [attachment, showIframe]);





    const getUserTrackForActivity = async () => {

        try {

            const response = await axiosObj.get(`/tracking/${user?._id}/${attachment?._id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setTrackObj(response.data);

        } catch (error) {
            console.log(error);
        }
    };




    const checkAndDownloadFile = async () => {

        if (attachment?.maxAttempts === trackObj?.attempts) {
            window.alert("Max attempts have been reached");
            setIframeSrc("");
            setShowIframe(false);
            return;
        }

        await downloadAndProcessZipFile();

    };





    const downloadAndProcessZipFile = async () => {

        try {

            const downloadUrl = `/attachment/download/${attachment?._id}`;

            const response = await axiosObj.get(downloadUrl, {
                responseType: "arraybuffer",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const zip = new JSZip();
            const content = await zip.loadAsync(response.data);

            const htmlFile = Object.keys(content.files).find((filename) => filename.endsWith(".html"));

            if (htmlFile) {
                
                const htmlContent = await zip.file(htmlFile).async("string");
                const blobUrl = URL.createObjectURL(new Blob([htmlContent], { type: "text/html" }));

                setIframeSrc(blobUrl);

                setUpdatedTracking({
                    ...updatedTracking,
                    questions: attachment?.questions,
                    activityId: attachment?._id,
                    startingTime: Date.now(),
                });

            } else {
                console.error("No HTML file found in the ZIP archive.");
            }

        } catch (error) {

            if (error.response && error.response.data) {
                console.error("Error:", error.response.data.msg);
            } else {
                console.error("An unexpected error occurred:", error.message);
            }
            
        }
    };





    const trackingEventHandler = async (e) => {

        const { type, payload } = e.data;

        if (!attachment) return;

        let requestObject = { ...updatedTracking };

        switch (type) {

            case "START_ACTIVITY":

                requestObject = { ...updatedTracking };
                break;

            case "SUBMIT_ACTIVITY":

                const updatedQuestions = updatedTracking?.questions?.map((question) => {

                    const foundQuestion = payload?.questions?.find((q) => q?.question === question?.question);

                    if (foundQuestion) {
                        return {
                            ...question,
                            userAnswer: foundQuestion.userAnswer,
                        };
                    }

                    return question;

                });

                requestObject = {
                    ...updatedTracking,
                    questions: updatedQuestions,
                    endingTime: Date.now(),
                    startingTime: updatedTracking.startingTime,
                };

                try {

                    const response = await axiosObj.post(`/tracking/${attachment?._id}`, requestObject, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    setUpdatedTracking(response.data);

                    if (response.status === 200) {

                        setOpenPopUp(true);

                        const message = {
                            userScore: response.data.userScore,
                            passed: response.data.passed,
                            spentTime: parseFloat(response.data.spentTime.toFixed(2))
                        };

                        setMessage(message);

                    }

                    setShowIframe(false);

                } catch (error) {
                    console.error('Error updating tracking:', error);
                }
                break;

            default:
                return;
        }
    };




    useEffect(() => {

        window.addEventListener("message", trackingEventHandler);

        return () => window.removeEventListener("message", trackingEventHandler);

    }, [attachment, updatedTracking]);




    const toggleSection = (sectionId) => {
        setExpandedSections((prevSections) =>
            prevSections.includes(sectionId)
                ? prevSections.filter((id) => id !== sectionId)
                : [...prevSections, sectionId]
        );
    };





    return (
        <div className="course-main-page">

            <div className="left-column">

            <button onClick={() => navigate(`/instructor/course/${courseId}/structure` , {state : {changed : true}})}>back</button>

                {showIframe && (

                    <div>

                        <Iframe src={iframeSrc}/>

                    </div>

                )}

            </div>

            <div className="right-column">

                {course?.sections?.map((section) => (

                    <div key={section?._id} className="section">

                        <button onClick={() => toggleSection(section?._id)}>
                            {section?.name}
                        </button>

                        {expandedSections.includes(section?._id) && (

                            <div className="section-items">

                                {section?.items?.map((item) => (

                                    <div key={item?._id} className="section-item">

                                        <div>{item?.name}</div>

                                        {item?.attachments?.map((attachment) => (

                                            <button
                                                onClick={() => {
                                                    setAttachment(attachment);
                                                    setShowIframe(true);
                                                }}

                                                key={attachment?._id}
                                            >

                                                {attachment.activityFileName.split("-")[0]}

                                            </button>
                                        ))}

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                ))}

            </div>
            
            {openPopUp && <PopUp message={message} onClose={() => setOpenPopUp(false)} />}

        </div>  
        
    );
};


export default CourseMainPage;
