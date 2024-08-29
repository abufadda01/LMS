import React, { useEffect, useState } from 'react';
import { useParams , useNavigate , useLocation } from 'react-router-dom';
import './course-structure.css';
import { 
    useGetCourseByIdQuery, 
    useUpdateCourseSectionsMutation, 
    useDeleteCourseSectionMutation,
    useDeleteCourseItemMutation,
    useUploadActivityMutation,
} from '../../../store/apis/InstructorApi';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import {  
    setCourseData,
    addSectionToCourse,
    addItemToSection,
    renameItemInSection,
    renameSection as renameSectionAction,
    addAttachmentToItem,
    deleteSection as deleteSectionAction,
    deleteItem as deleteItemAction ,
    resetAttachment
} 
from '../../../store/slices/instructorSlice';

import CourseSection from './CourseSection';

import {
     useUploadAttachmentAdminMutation , 
     useDeleteAttachmentAdminMutation , 
     useAddItemToSectionFunMutation , 
     useAddSectionToCourseFunMutation , 
     useAssignCourseToAdminMutation 
} from '../../../store/apis/AdminApi';



const CourseStructure = () => {
    
    const { token } = useSelector((state) => state.user);
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { courseId } = params;

    const [course, setCourse] = useState({
        sections: []
    });

    // console.log(course)

    const [updateCourseSections] = useUpdateCourseSectionsMutation();
    const [deleteCourseSection] = useDeleteCourseSectionMutation();
    const [deleteCourseItem] = useDeleteCourseItemMutation();
    const [uploadAttachment] = useUploadAttachmentAdminMutation();
    const [uploadActivity] = useUploadActivityMutation();
    const [deleteAttachmentAdmin] = useDeleteAttachmentAdminMutation();
    const [addItemToSectionFun] = useAddItemToSectionFunMutation();
    const [addSectionToCourseFun] = useAddSectionToCourseFunMutation();
    const [assignCourseToAdmin] = useAssignCourseToAdminMutation();

    const { data , error , isLoading , refetch } = useGetCourseByIdQuery({ courseId, token });
    
    
    useEffect(() => {
        if (data) {
            setCourse(data);
            dispatch(setCourseData({ courseId, sections: data.sections }));
        }
    }, [data, dispatch , location]);


    useEffect(() => {
        if(location?.state?.changed){
            refetch()
        }
    } , [location.state])  



    const removeIdWithUUIDStructure = (array) => {

        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        const removeIdsRecursively = (obj) => {

            if (Array?.isArray(obj)) {
                return obj.map(item => removeIdsRecursively(item));
            }

            if (typeof obj === 'object') {

                const newObj = {};

                for (const key in obj) {

                    if (key !== '_id') {
                        newObj[key] = removeIdsRecursively(obj[key]);
                    }

                }

                return newObj;
            }

            return obj;
        };

        return removeIdsRecursively(array);
    };




    const saveCourseSections = async () => {

        try {

            const resultArray = removeIdWithUUIDStructure(course.sections);
            await updateCourseSections({ token, courseId, sections: resultArray }).unwrap();
            const updatedData = await useGetCourseByIdQuery({ courseId, token }).unwrap();
            setCourse(updatedData);
            dispatch(setCourseData({ courseId, sections: updatedData.sections })); 
            toast.success('course sections saved successfully');

        } catch (error) {
            // toast.error('Failed to update course sections');
        }
    };




    const handleAddSection = async () => {

        const lastSection = course.sections[course.sections.length - 1];

        if (lastSection && lastSection.items.length === 0) {
            return toast.error('Add at least one item to the last section before adding a new one.');
        }

        try {
            const newSection = { _id: uuidv4(), name: 'New Section', items: [] };
            const response = await addSectionToCourseFun({courseId , token , name : newSection.name , items : newSection.items}).unwrap()
            setCourse(response)
            dispatch(setCourseData({ courseId, sections: response.sections })); 
            dispatch(addSectionToCourseFun({ courseId, section: newSection }));
            await saveCourseSections() 
            await refetch()
            toast.success('new section added successfully');
        } catch (error) {
            console.log(error)
        }
    };




    const handleRenameSection = (sectionId, newName) => {

        setCourse(prevCourse => ({
            ...prevCourse,
            sections: prevCourse.sections.map(section => (section._id === sectionId ? { ...section, name: newName } : section))
        }));

        dispatch(renameSectionAction({ courseId, sectionId, newName }));
    }; 




    const handleDeleteSection = async (sectionId) => {

        setCourse(prevCourse => ({ ...prevCourse, sections: prevCourse.sections.filter(section => section._id !== sectionId) }));
       
        try {

            await deleteCourseSection({ token, courseId, sectionId });
            dispatch(deleteSectionAction({ courseId, sectionId }));
            toast.info("Section removed successfully");

        } catch (error) {
            console.log(error);
        }
    };

 


    const handleAddItem = async (sectionId, type) => {
        
        let newItem = { _id: uuidv4(), type, name: `New ${type}`, attachments: [] };
        
        const response = await addItemToSectionFun({courseId , sectionId , token , name : newItem.name , type , attachments : newItem.attachments}).unwrap()
        
        setCourse(response)
  
        dispatch(addItemToSection({ courseId, sectionId, item: newItem }));

        dispatch(setCourseData({ courseId, sections: response.sections }));

    };




    const handleRenameItem = (sectionId, itemId, newName) => {

        setCourse(prevCourse => ({
            ...prevCourse,
            sections: prevCourse.sections.map(section => ({
                ...section,
                items: section.items.map(item => (item._id === itemId ? { ...item, name: newName } : item))
            }))

        }));

        dispatch(renameItemInSection({ courseId, sectionId, itemId, newName }));

    };




    const handleAddAttachment = async ({ courseId, sectionId, itemId, attachment, attachment_name, type, token }) => {
        
        try {

            const formData = new FormData();

            formData.append('activityFile', attachment);

            const response = await uploadActivity({ courseId, sectionId, itemId, attachment , token }).unwrap();
            const newAttachment = { name: response.name, url: response.url };

            setCourse(response)
            dispatch(addAttachmentToItem({ courseId, sectionId, itemId, attachment: newAttachment }));
            dispatch(setCourseData(updatedCourse));
        
        } catch (error) {
            // console.error('Failed to upload attachment:', error);
            // toast.error('Failed to upload attachment');
        }
    };




    const handleDeleteItem = async (sectionId, itemId) => {
        
        setCourse(prevCourse => ({
            ...prevCourse,
            sections: prevCourse.sections.map(section => ({
                ...section,
                items: section.items.filter(item => item._id !== itemId)
            }))
        }));
        
        try {

            await deleteCourseItem({ token, courseId, sectionId, itemId });
            dispatch(deleteItemAction({ courseId, sectionId, itemId }));
            toast.info("Item removed successfully");
            
        } catch (error) {
            console.log(error);
        }
    };
    
    

    const assignCourse = async (e) => {
        try {
            await assignCourseToAdmin({token , courseId}).unwrap()
            await refetch()
            toast.info("course assigned successfully");
            navigate("/instructor/courses" , {state : {changed : true}})
        } catch (error) {
            toast.error(error.response.data.msg);
        }
    }

    

    useEffect(() => {
        refetch();
    }, [courseId, location.state]);




    return (
        <>  

            <div className='header-structure'>
                <h1 className='course-title'>Course Structure for : <span className='course-name'>{data?.title} __ {courseId}</span></h1>
                {course.instructorId === null && <button onClick={assignCourse} className='add-section-btn'>assign to me</button>}
            </div>
          
            <div className="container">

                {course.sections.map((section) => (
                    <CourseSection
                        key={section._id}
                        section={section} 
                        courseId={courseId}
                        renameSection={handleRenameSection}
                        addItem={handleAddItem}
                        deleteSection={handleDeleteSection}
                        renameItem={handleRenameItem}
                        uploadAttachment={handleAddAttachment}
                        deleteItem={handleDeleteItem} 
                        saveCourseSections={saveCourseSections}
                        setCourse={setCourse}
                    /> 
                ))} 

            </div> 

            <button className='add-section-btn' onClick={handleAddSection}>Add Section</button>
            <button onClick={saveCourseSections} disabled={course?.sections.length === 0} className='add-section-btn save-btn'>Save Course Materials</button>
            
            <button className='add-section-btn' disabled={course.sections.length === 0} onClick={() => navigate(`/instructor/course/${course?._id}/main`)}>see final course material</button>
        
        </> 
    );
};


export default CourseStructure;
