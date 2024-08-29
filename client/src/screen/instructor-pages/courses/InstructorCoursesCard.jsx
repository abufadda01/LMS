import React, { useEffect } from 'react';
import styles from "./instructor-courses.module.css";
import { useNavigate } from 'react-router-dom';
import { useDeletCourseMutation } from '../../../store/apis/AdminApi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoursesSuccess } from '../../../store/slices/instructorSlice';




const InstructorCoursesCard = ({ course, refetch }) => {


  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { token , user} = useSelector((state) => state.user);

  const [deleteCourse, { isLoading }] = useDeletCourseMutation();


  function formatDate(dateString) {
    if (!dateString) return ""; 
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }




  const deleteCourseFun = async (e) => {

    e.stopPropagation(); 

    try {

      await deleteCourse({ token, courseId: course._id }).unwrap();
      await refetch(); 

    } catch (error) {
      console.log(error);
    }

  };




  return (
    <div onClick={() => navigate(`/instructor/course/${course?._id}/structure`)} className={styles.card}>
      
      <div className={styles.headerCard}>

        <h2 className={styles.courseName}>{course?.title}</h2>
        {user.role === "admin" && <button onClick={deleteCourseFun}>X</button>}

      </div>

      <div className={styles.courseDetails}>

        <p><strong>Available from :</strong> <span className={styles.numStudents}>{formatDate(course?.startDate)}</span> <strong>Until :</strong> <span className={styles.numStudents}>{formatDate(course?.endDate)}</span></p>
        <p><strong>Students :</strong> <span className={styles.numStudents}>{course?.studentsEnrolled.length}</span></p>
        <p><strong>Sections :</strong> <span className={styles.numQuizzes}>{course?.sections.length}</span></p>
      
      </div>

    </div>
    
  );
};


export default InstructorCoursesCard;
