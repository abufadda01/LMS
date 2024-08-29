import React, { useEffect, useState } from 'react';
import { useGetFilterdCoursesQuery, useGetAllInstructorsAdminQuery } from '../../../store/apis/AdminApi';
import { useSelector } from 'react-redux';
import styles from './AdminFilteredCourses.module.css';
import { useNavigate, useLocation } from 'react-router-dom';



const AdminFilteredCourses = () => {

  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState({
    page: 1,
    instructorId: '',
    noInstructor: '',
    startDate: '',
    endDate: '',
    title: '',
    minRate: '',
    maxRate: ''
  });


  const { data: coursesData, error: coursesError, isLoading: coursesLoading, refetch: refetchFilteredCourses } = useGetFilterdCoursesQuery({
    token,
    ...filters
  });


  const { data: instructorsData, error: instructorsError, isLoading: instructorsLoading, refetch: refetchInstructors } = useGetAllInstructorsAdminQuery({
    token,
    page: 1
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };


  const handlePageChange = (newPage) => {
    if (newPage > 0 && (newPage <= coursesData.pagination.totalPages || !coursesData)) {
      setFilters({ ...filters, page: newPage });
    }
  };


  useEffect(() => {
    if (filters.page > 1 && (!coursesData || coursesData.data.length === 0)) {
      handlePageChange(filters.page - 1);
    }
  }, [coursesData]);



  useEffect(() => {
    if (location?.state?.changed) {
      refetchFilteredCourses();
      refetchInstructors();
      setFilters({ page: 1, endDate: '', startDate: '', instructorId: '', maxRate: '', minRate: '', noInstructor: '', title: '' });
    }
  }, [location?.state]);



  useEffect(() => {
    refetchFilteredCourses();
  }, [filters, location?.state]);



  if (coursesLoading) return <p>Loading...</p>;
  
  if (coursesError) return <p>Error: {coursesError.message}</p>;



  return (
    <div className={styles.adminFilteredCoursesContainer}>

      <div className={`${styles.adminFilteredCoursesColumn} ${styles.adminFilteredCoursesFilters}`}>

        <h1 className={styles.adminFilteredCoursesTitle}>Filtered Courses</h1>

        <div>

          <div className={styles.adminFilteredCoursesFormGroup}>

            <label className={styles.adminFilteredCoursesLabel}>Instructor:</label>

            <select className={styles.adminFilteredCoursesSelect} name="instructorId" value={filters.instructorId} onChange={handleInputChange}>
             
              <option value="">Select an Instructor</option>

              {instructorsLoading ? (
                <option>Loading...</option>
              ) : instructorsError ? (
                <option>Error loading instructors</option>
              ) : (
                instructorsData?.allInstructors.map((instructor) => (
                  <option key={instructor?._id} value={instructor?._id}>
                    {instructor?.name}
                  </option>
                ))
              )}

            </select>

          </div>

          <div className={styles.adminFilteredCoursesFormGroup}>

            <label className={styles.adminFilteredCoursesLabel}>No Instructor:</label>

            <input
              type="checkbox"
              name="noInstructor"
              checked={filters.noInstructor}
              onChange={(e) => setFilters({ ...filters, noInstructor: e.target.checked ? 'true' : '' })}
              className={styles.adminFilteredCoursesCheckbox}
            />

          </div>

          <div className={styles.adminFilteredCoursesFormGroup}>

            <label className={styles.adminFilteredCoursesLabel}>Start Date:</label>

            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
              className={styles.adminFilteredCoursesInput}
            />

          </div>

          <div className={styles.adminFilteredCoursesFormGroup}>

            <label className={styles.adminFilteredCoursesLabel}>End Date:</label>

            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
              className={styles.adminFilteredCoursesInput}
            />

          </div>

          <div className={styles.adminFilteredCoursesFormGroup}>

            <label className={styles.adminFilteredCoursesLabel}>Course Title:</label>

            <input
              type="text"
              name="title"
              value={filters.title}
              onChange={handleInputChange}
              className={styles.adminFilteredCoursesInput}
            />

          </div>

          <div className={styles.adminFilteredCoursesFormGroup}>

            <label className={styles.adminFilteredCoursesLabel}>Min Rate:</label>

            <input
              type="number"
              name="minRate"
              value={filters.minRate}
              onChange={handleInputChange}
              className={styles.adminFilteredCoursesInput}
            />

          </div>

          <div className={styles.adminFilteredCoursesFormGroup}>

            <label className={styles.adminFilteredCoursesLabel}>Max Rate:</label>

            <input
              type="number"
              name="maxRate"
              value={filters.maxRate}
              onChange={handleInputChange}
              className={styles.adminFilteredCoursesInput}
            />

          </div>

        </div>

      </div>

      <div className={`${styles.adminFilteredCoursesColumn} ${styles.adminFilteredCoursesResults}`}>

        <ul className={styles.adminFilteredCoursesList}>

          {coursesData?.data.map((course) => (

            <li onClick={() => navigate(`/instructor/course/${course?._id}/structure`, { state: { changed: true } })} key={course?._id} className={styles.adminFilteredCoursesListItem}>
              {course?.title}
            </li>
          ))}

        </ul>

        {coursesData?.data?.length === 0 && "No courses with this filtered data"}

        <div>

          <button
            className={`${styles.adminFilteredCoursesButton} ${filters.page <= 1 && styles.adminFilteredCoursesButtonDisabled}`}
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}>
            Previous
          </button>

          <button
            className={`${styles.adminFilteredCoursesButton} ${filters.page >= coursesData?.pagination?.totalPages && styles.adminFilteredCoursesButtonDisabled}`}
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= coursesData?.pagination?.totalPages}>
            Next
          </button>

        </div>

      </div>

    </div>

  );
};


export default AdminFilteredCourses;
