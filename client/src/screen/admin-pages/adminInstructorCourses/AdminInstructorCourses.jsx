import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllInstructorsAdminQuery, useGetInstructorCoursesAdminQuery } from "../../../store/store";
import Spinner from "../../../components/Spinner";
import "./index.css";
import InstructorCoursesCard from "../../instructor-pages/courses/InstructorCoursesCard";
import { useDeleteInstructorMutation } from "../../../store/apis/AdminApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const AdminInstructorCourses = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token , user } = useSelector((state) => state.user);

  const [page, setPage] = useState(1);
  const [instructorId, setInstructorId] = useState('');
  const [isMyCourses, setIsMyCourses] = useState(false);

  const { data: instructors, error: instructorsError, isLoading: instructorsLoading  } = useGetAllInstructorsAdminQuery({ page, token });

  const { data: instructorCourses, error: instructorCoursesError, isLoading: instructorCoursesLoading, refetch: refetchInstructorCourses } = useGetInstructorCoursesAdminQuery({ instructorId, page, token }, { skip: !instructorId });

  const [deleteInstructor] = useDeleteInstructorMutation()

  useEffect(() => {
    if (instructorId) {
      refetchInstructorCourses();
    }
  }, [instructorId, refetchInstructorCourses , page]);



  const handleSelectChange = (event) => {
    setInstructorId(event.target.value);
    const selectedInstructor = instructors?.allInstructors.find((inst) => inst._id === event.target.value);
    setIsMyCourses(selectedInstructor && selectedInstructor.name === user.name);
  };


  if (instructorsLoading || instructorCoursesLoading) {
    return <Spinner />;
  }


  if (instructorsError || instructorCoursesError) {
    return <div>Error loading instructors</div>;
  }


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

  


  const removeInstructor = async () => {
    try {
      await deleteInstructor({token , instructorId})
      toast.info("instructor deleted successfully")
      navigate("/admin/courses/filtered" , {state : {changed : true}})    
    } catch (error) {
      toast.error(error.response.data.msg)
    }
  }


  
  
  



  return (
    <div>

        <h1>Instructor Courses</h1>

      <div className="ins-select-header">

        <div>

          <label htmlFor="instructors">Select Instructor: </label>

          <select
            id="instructors"
            value={instructorId}
            onChange={handleSelectChange}
          >

            <option value="">Select an instructor</option>

            {instructors.allInstructors.map((instructor) => (
              <option key={instructor._id} value={instructor._id}>
                {instructor.name}
              </option>
            ))}

          </select>

        </div>

        {instructorId && !isMyCourses  && <button onClick={removeInstructor} className="remove-instructor">delete instructor</button>}

      </div>

      {instructorId && instructorCourses && (

        <div className="courses-container">
          {instructorCourses?.instructorCourses?.map((course) => (
            <InstructorCoursesCard refetch={refetchInstructorCourses} key={course._id} course={course} />
          ))}
        </div>

      )}


      {instructorCourses?.instructorCourses.length === 0 && instructorId && <p>No courses for this instructor</p>}

      {instructorId && (
        <>
          <div className="pagination">
            
            <button onClick={handlePrevPage} disabled={page === 1}>
              Previous
            </button> 
          
            <span>Page {page} of {instructorCourses?.totalPages > 0 ? instructorCourses?.totalPages : page}</span>
          
            <button onClick={handleNextPage} disabled={page === 1}>
              Next
            </button>
        
          </div>
        
        </>  
      )
    }

    </div>

  );
};


export default AdminInstructorCourses;
