import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './index.css';
import { useGetAllEnrolmentsReqQuery, useUpdateEnrolmentStatusMutation } from '../../../store/apis/AdminApi';
import Spinner from '../../../components/Spinner';



export default function AdminEnrollmentPage() {

  const userSlice = useSelector((state) => state.user);
  const { token } = userSlice;
  
  const [page, setPage] = useState(1);
  const limit = 10;


  const { data, isLoading, refetch } = useGetAllEnrolmentsReqQuery({ token, page, limit });

  const [updateEnrolmentStatus] = useUpdateEnrolmentStatusMutation();


  const handleStatusChange = async (courseId, studentId, newStatus) => {
    try {
      await updateEnrolmentStatus({ courseId, studentId, token, newStatus });
      refetch();
    } catch (error) {
      console.error('Error updating enrollment status:', error);
    }
  };


  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch();
  };


  if (isLoading) return <Spinner />;


  const { enrolments, totalPages } = data;




  return (

    <div className="adminEnrollmentPage">

      <h1>All Enrollment Requests</h1>

      <div className="enrollmentCards">

        {enrolments?.map((enrollment) => (

          <div key={enrollment._id} className="enrollmentCard">

            <h3>{enrollment.courseId.title}</h3>
            <p>Student Name: {enrollment.studentId.name}</p>
            
            <p>
                Current Status:{" "}
                
                <span className={
                    enrollment.status === "pending" ? "status pending" : 
                    enrollment.status === "approved" ? "status approved" : 
                    enrollment.status === "rejected" ? "status rejected" : ""
                }>
                    {enrollment.status}

                </span>

                </p>

            <div>

              <select
                value={enrollment.status}
                onChange={(e) => handleStatusChange(enrollment?.courseId._id, enrollment?.studentId._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>

              </select>

            </div>

          </div>

        ))}

      </div>

      <div className="pagination">

        <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
          Previous
        </button>

        <span>{`Page ${page} of ${totalPages}`}</span>

        <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>
          Next
        </button>

      </div>

    </div>
  );
}
