import React, { useState } from "react";

const EnrollmentCard = ({ enrollment, handleStatusChange }) => {

  // Local state to keep track of the selected status
  const [selectedStatus, setSelectedStatus] = useState(enrollment.status);

  const onStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    handleStatusChange(enrollment.courseId, enrollment.studentId, newStatus);
  };


  return (
    <div className="enrollmentCard">
      {/* Other enrollment details */}
      <div>
        <select
          disabled={selectedStatus === enrollment.status}
          value={enrollment.status}
          onChange={onStatusChange}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
};

export default EnrollmentCard;
