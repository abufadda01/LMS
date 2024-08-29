import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addAttachmentToItem, deleteAttachmentFromItem } from '../../../store/slices/instructorSlice';
import { useDeleteAttachmentAdminMutation } from '../../../store/apis/AdminApi';


const CourseSection = ({
    section,
    courseId,
    renameSection,
    addItem,
    deleteSection,
    renameItem,
    uploadAttachment, 
    deleteItem,
    saveCourseSections,
    setCourse
}) => {


    const { token } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [attachmentState, setAttachmentState] = useState({});
    const [shouldRenderButtons, setShouldRenderButtons] = useState(true);
    const [deleteAttachmentAdmin] = useDeleteAttachmentAdminMutation();


    const handleAddItem = async (type) => {
        await addItem(section._id, type);
        // await saveCourseSections();
        setShouldRenderButtons(false);
    };



    useEffect(() => {
        if (section.items.some(item => !item._id.includes("-"))) {
            setShouldRenderButtons(true);
        }
    }, [section.items]);




    const handleAttachmentChange = (itemId, field, value) => {
        setAttachmentState(prevState => ({
            ...prevState,
            [itemId]: {
                ...prevState[itemId],
                [field]: value
            }
        }));
    };




    const handleFileChange = (itemId, e) => {
        handleAttachmentChange(itemId, 'file', e.target.files[0]);
    };




    const handleAttachmentUpload = async (sectionId, itemId) => {

        const { file } = attachmentState[itemId] || {};

        if (file) {

            try {

                const response = await uploadAttachment({
                    courseId,
                    sectionId,
                    itemId,
                    attachment: file,
                    token,
                }).then(response => response.data);

                const newAttachment = { name : response.name , url: response.url };

                setCourse(prevCourse => ({
                    ...prevCourse,
                    sections: prevCourse.sections.map(section => ({
                        ...section,
                        items: section.items.map(item => (item._id === itemId ? { ...item, attachments: [...item.attachments, newAttachment] } : item))
                    }))
                }));

                dispatch(addAttachmentToItem({ courseId, sectionId, itemId, attachment: newAttachment }));

                setAttachmentState(prevState => ({
                    ...prevState,
                    [itemId]: { file: null}
                }));

            } catch (error) {
                // console.error('Failed to upload attachment:', error);
                // toast.error('Failed to upload attachment');
            }
        } else {
            toast.error('All fields (attachment, attachment name, and type) are required');
        }
    };




    const handleAttachmentDelete = async (courseId, sectionId, itemId, attachmentId, token) => {
        
        try {

            const response = await deleteAttachmentAdmin({
                courseId,
                sectionId,
                itemId,
                attachmentId,
                token,
            }).unwrap();
            
            
            setCourse(prevCourse => ({
                ...prevCourse,
                sections: prevCourse.sections.map(section => ({
                    ...section,
                    items: section.items.map(item => (item._id === itemId ? { ...item, attachments: item.attachments.filter(att => att._id !== attachmentId) } : item))
                }))
            }));

            dispatch(deleteAttachmentFromItem({ courseId, sectionId, itemId, attachmentId }));

            setAttachmentState(prevState => ({
                ...prevState,
                [itemId]: { file: null, name: '', type: '' } 
            }));

        } catch (error) {
            console.error('Error deleting attachment:', error);
        }
    };




    return (
        <div className="section">

            <div className="section-header">

                <input
                    type="text"
                    value={section.name}
                    onChange={(e) => renameSection(section._id, e.target.value)}
                />

                <div className='actions-btn'>
                    <button onClick={() => handleAddItem('Activity')}>Add Activity</button>
                    <button onClick={() => handleAddItem('Video')}>Add Video</button>
                    <button onClick={() => handleAddItem('Image')}>Add Image</button>
                    <button onClick={() => deleteSection(section._id)}>Delete Section</button>
                </div>

            </div>

            <div className="items">

                {section.items.map((item) => (

                    <div key={item._id} className="item">

                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => renameItem(section._id, item._id, e.target.value)}
                        />

                        <div className="type-actions-btn">

                            {item.attachments.length > 0 ? (

                                <div className="attachments">

                                    {item.attachments.map((attachment, index) => (

                                        <div key={index} className="attachment">
                                            <a href={attachment.file_path} target="_blank" rel="noopener noreferrer">{attachment.attachment_name}</a>
                                            <button onClick={() => handleAttachmentDelete(courseId , section._id , item._id , attachment._id , token)}>Delete Attachment</button>
                                        </div>

                                    ))}

                                </div>

                            ) : (

                                <>
                                    <input type="file" onChange={(e) => handleFileChange(item._id, e)} />
                                    
                                    <button onClick={() => handleAttachmentUpload(section._id, item._id)}>Upload Attachment</button>
                                
                                </>
                            )}

                            <button onClick={() => deleteItem(section._id, item._id)}>Delete {item.type}</button>
                        
                        </div>
                       
                        <span className='type'>({item.type})</span>
                        
                        <div className="attachments">
                            {item.attachments.map((attachment, index) => (
                                <div key={index} className="attachment">{attachment.name}</div>
                            ))}
                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default CourseSection;
