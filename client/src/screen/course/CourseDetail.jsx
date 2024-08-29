import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetCourseByIdQuery, useReqCourseEnrollmentMutation, useCheckEnrolmentStatusQuery } from "../../store/apis/CoursesApi";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import "../../style/courseDetail.scss";



export default function CourseDetail() {

  const userSlice = useSelector((state) => state.user);
  const { token } = userSlice;

  const params = useParams();
  const courseId = params.courseId;


  const { data: course , isLoading: isCourseLoading } = useGetCourseByIdQuery({ token, courseId });
  const { data: enrolmentStatusData , isLoading: isStatusLoading , refetch } = useCheckEnrolmentStatusQuery({ token, courseId });


  const [reqCourseEnrollment] = useReqCourseEnrollmentMutation();


  const [item, setItem] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });


  const currentV = (e) => {
    const { value, name } = e.target;
    setItem({ ...item, [name]: value });
  };



  const handleCourseEnrolment = async (e) => {

    e.preventDefault();

    try {
      const response = await reqCourseEnrollment({ token, ...item, courseId });
      await refetch()
      setIsRequested(true);
      setEnrollmentStatus(response.data.status); 
    } catch (error) {
      console.error("Error requesting course enrollment:", error);
    }

  };



  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };



  if (isCourseLoading || isStatusLoading) return <Spinner />;



  return (
    <div>

      <section className="courseDetail">

        {course && (

          <div className="detail">

            <div className="courseDescription">

              <div className="course-detail">
                <h1>{course.course.title.toUpperCase()}</h1>
              </div>

              <div className="courseDuration">

                <h4>
                  Course Duration:{" "}

                  <span style={{ color: "#03aae2" }}>{formatDate(course?.course?.startDate)}</span>{" "}

                  <strong> to </strong>{" "}

                  <span style={{ color: "#03aae2" }}>{formatDate(course?.course?.endDate)}</span>
                
                </h4>

              </div>

              <div className="noOfQuiz">

                <h4>
                  Course Rate:{" "}
                  <span style={{ color: "#03aae2" }}>{course?.course?.rate}</span>
                </h4>

              </div>

              <div className="leadTrainer">

                <h4>
                  Price: <span style={{ color: "#03aae2" }}>{course?.course?.price} JD</span>
                </h4>

              </div>

              <div className="leadTrainer">

                <h4>
                  Lead Trainer:{" "}
                  <span style={{ color: "#03aae2" }}>{course?.course?.instructorId?.name}</span>
                </h4>

              </div>

            </div>


          </div>
        )}


        {enrolmentStatusData?.alreadyRequested 
        ? 
        (

          <div className="enrollmentStatus">
            <h2>Enrollment Request Status: {enrolmentStatusData.status}</h2>
            {enrolmentStatusData.status === "approved" && <Link className="course-material" to={`/instructor/course/${courseId}/main`}>see course material</Link> }
          </div>

        ) 
        : 
        (

          <div className="courseForm">

            <div className="heading">
              <h1>Course Enrollment Form</h1>
            </div>

            <form onSubmit={handleCourseEnrolment}>

              <input
                type="text"
                placeholder="Enter first Name"
                name="firstName"
                onChange={currentV}
                value={item.firstName}
              />

              <input
                type="text"
                placeholder="Enter last name"
                name="lastName"
                onChange={currentV}
                value={item.lastName}
              />

              <input
                type="email"
                placeholder="Student Email"
                name="email"
                onChange={currentV}
                value={item.email}
              />

              <input
                type="number"
                placeholder="Enter phone no"
                name="phone"
                onChange={currentV}
                value={item.phone}
              />

              <input
                type="text"
                placeholder="City"
                name="city"
                onChange={currentV}
                value={item.city}
              />

              <input
                type="text"
                placeholder="Street Address"
                name="address"
                onChange={currentV}
                value={item.address}
              />

              <div className="button">
                <button type="submit">Enroll</button>
              </div>

            </form>

          </div>

        )}

      </section>

    </div>
  );
}
