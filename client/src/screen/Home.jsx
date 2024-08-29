import { useState } from "react";
// import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Home.scss";
import {  useSelector } from "react-redux";
import { useGetAllCoursesQuery } from "../store/apis/CoursesApi";



export default function Home() {

    let [course, setCourse] = useState();
    let [page , setPage] = useState(1);
  
    const userSlice = useSelector((state) => state.user);

    const { user, token } = userSlice;

    const {data : courses , isLoading , error} = useGetAllCoursesQuery({token , page})
     
    let [quiz, setQuiz] = useState();
  
    let [studentRegistration, setStudentRegistration] = useState();
    
    let [trainerRegistration, setTrainerRegistration] = useState();
  

  
    let navigate = useNavigate();

    const handlerNavgator=(state)=>{
      
      navigate('/courseDetails',{state:state})

    }



    function formatDate(dateString) {

      if (!dateString) return ""; 
    
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
    
      return `${year}-${month}-${day}`;
    
    }


    const handleNextPage = () => {
      if (page < courses.totalPages) setPage(page + 1);
    };

    const handlePreviousPage = () => {
      if (page > 1) setPage(page - 1);
    };

    const handlePageChange = (pageNum) => {
      setPage(pageNum);
    };




  return (
    <section className="home">

      <div className="hero">
      
        <div className="leftSide">
      
          <h1>نظام إدارة التعلم</h1>
      
          <p>
          أفضل أنظمة LMS مدعومة بتقنيات الذكاء الاصطناعي والذكية وتسمح بالتكامل السحابي مع أنظمة الموارد البشرية وإدارة المؤسسات الأخرى الحاسمة. يضم نظام إدارة التعلم، ويسلم، ويتتبع جميع محتويات التعلم والتدريب
          </p>
      
          <button onClick={() => navigate("/course")}>الدروس</button>
      
        </div>
      
        <div className="rightSide1">
      
          <div className="image"></div>
      
        </div>
      
      </div>

      <div className="shortInfo">
      
      </div>



      <div className="courses">

        <div className="heading">
          <h1>Course</h1>
        </div>
        
        <div className="box">
        
          {courses && courses.courses.length > 0 ? (
        
            courses.courses.map((course, index) => {
              return (
                <div
                  key={index}
                  className="box1"
                  onClick={() =>
                    navigate(`course/course-detail/${course?._id}`)
                  }
                >
                  <div className="description">

                    <h1>{course?.title}</h1>

                    <p><strong>Available from :</strong> <span>{formatDate(course?.startDate)}</span> <strong>Until :</strong> <span>{formatDate(course?.endDate)}</span></p>
                    
                    <p>no. of Quiz: {course?.quizzes?.length}</p>
                    {/* {token &&  <Rating rate={course?.rate}/>} */}

                    <p style={{fontWeight:"800"}}>JOR {course?.price}</p>

                  </div>

                </div>

                
              );
            })
          ) : (
            <p>Empty</p>
          )}

        </div>

        <div className="pagination">

          <button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </button>

          {Array.from({ length: courses?.totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </button>
          ))}

          <button onClick={handleNextPage} disabled={page === courses?.totalPages}>
            Next
          </button>

        </div>
      
      </div>



      <div className="footer">

        <div className="parentFooter">

          <div className="box11">

            <div className="logo">

              <h1 onClick={() => navigate("/")}>TAJSEER</h1>

              <p>The Professional Academy</p>

            </div>

            <p>0314-2255-345</p>

          </div>

          <div className="box12">

            <h1>Pages</h1>

            <ul>

              <li>
                <Link to={"course"}>الدروس</Link>
              </li>

              <li>
                <Link to={"quiz"}>اختبار</Link>
              </li>

              <li>
                <Link to={"result"}>النتيجة</Link>
              </li>

              <li>
                <Link to={"login"}>دخول</Link>
              </li>

              <li>
                <Link to={"sign-up"}>تسجيل</Link>
              </li>

            </ul>

          </div>

          <div className="box13">

            <h1>Registration Form</h1>

            <ul>

              <li>
                <Link to={"student-registration-form"}>
                  نموذج تسجيل طالب                
                </Link>
              </li>

              <li>
                <Link to={"trainer-registration-form"}>
                  نموذج تسجيل متدرب
                </Link>
              </li>

            </ul>

          </div>

        </div>

        <div className="childFooter">

          <h4>Copyright © 2024 TAJSEER (The Professional Academy) All rights reserved</h4>

          <div className="goToTop">
            <a href="#"><i className="fa-solid fa-angle-up"></i></a>
          </div>

        </div>
        
      </div>
      
    </section>
  );
}
