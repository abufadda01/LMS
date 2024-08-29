import React, { useEffect, useState } from "react";
import { Link, useNavigate , useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useGetInstructorCoursesQuery } from "../../../store/store";
import InstructorCoursesCard from "./InstructorCoursesCard";
import styles from "./instructor-courses.module.css"
import { fetchCoursesSuccess , addCourseSuccess } from "../../../store/slices/instructorSlice";
import { useCreateNewCourseMutation } from "../../../store/apis/InstructorApi";



const InstructorCourses = () => {

  const dispatch = useDispatch()
  const location = useLocation()

  const [page, setPage] = useState(1);
  const [title, setTtile] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { token } = useSelector((state) => state.user);

  const { data : instructorCourses , error , isLoading , refetch } = useGetInstructorCoursesQuery({ page , token });
  const [createNewCourse , {data , error : createNewCourseError , isLoading : createNewCourseLoading}] = useCreateNewCourseMutation();
  
  const { courses, totalPages, currentPage } = useSelector((state) => state.instructor);

  const handleNextPage = () => {
    if (page < instructorCourses.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };



  useEffect(() => {
    
      dispatch(fetchCoursesSuccess({
        courses: instructorCourses?.courses,
        totalCourses: instructorCourses?.totalCourses,
        totalPages: instructorCourses?.totalPages,
        currentPage: instructorCourses?.currentPage,
      }));

  } , [dispatch, instructorCourses , refetch , location.state])




  useEffect(() => {
    if(location?.state?.changed){
      refetch()
    }
  } , [location?.state])




  const handleAddCourse = async (e) => {

    e.preventDefault();

    try {

      const response = await createNewCourse({
        token,
        title,
        startDate,
        endDate,
      }).unwrap();

      refetch()

      dispatch(addCourseSuccess(response));

      setTtile("");
      setStartDate("");
      setEndDate("");

    } catch (error) {
      console.log(error)
    }
  }



  const filteredCourses = courses?.filter(
    (course) => course?.title && course?.startDate && course?.endDate
  );


  
  
  return (

      <div className={styles.container}>
        
        <form onSubmit={handleAddCourse} className={styles.form}>

        <input
          type="text"
          placeholder="Course Name"
          value={title}
          onChange={(e) => setTtile(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      
        <button type="submit">Add Course</button>
      
      </form>

      {isLoading && <p>Loading...</p>}
      
      {error && <p>Error: {error.message}</p>}

        {filteredCourses && filteredCourses.map((course) => (
          <InstructorCoursesCard refetch={refetch} key={course?._id} course={course}/>
        ))}

        <div className={styles.pagination}>
        
          <button onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </button> 
        
          <span>Page {page} of {instructorCourses?.totalPages > 0 ? instructorCourses?.totalPages : page}</span>
        
          <button onClick={handleNextPage} disabled={page === 1}>
            Next
          </button>
      
        </div>

      </div>
  );
}

export default InstructorCourses