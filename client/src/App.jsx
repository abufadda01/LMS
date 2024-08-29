import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// components
import Boilerplate from "./components/Boilerplate";
import Home from "./screen/Home";
import Login from "./screen/authentication/Login";
import SignUp from "./screen/authentication/SignUp";
import Error from "./components/Error.jsx";
import Course from "./screen/course/Course";
import CourseHome from "./screen/course/CourseHome.jsx";
import CourseDetail from "./screen/course/CourseDetail.jsx";
import Quiz from "./screen/Public-Quiz/Quiz";
import QuizCategory from "./screen/Public-Quiz/QuizCategory";
import QuizLevel from "./screen/Public-Quiz/QuizLevel";
import DisplayQuiz from "./screen/Public-Quiz/DisplayQuiz";
import StudentRegisterForm from "./screen/public-registration-form/StudentRegisterForm.jsx";
import TrainerRegisterForm from "./screen/public-registration-form/TrainerRegisterForm.jsx";
import Dashboard from "./screen/dashboard/Dashboard";
import DashboardHome from "./screen/dashboard/DashboardHome.jsx";
import CreateCourse from "./screen/dashboard/course/CreateCourse.jsx";
import CreateQuiz from "./screen/dashboard/quiz/CreateQuiz.jsx";
import StudentRegistrationList from "./screen/dashboard/registration/studentRegistrationList/StudentRegistrationList.jsx";
import StudentRegistrationListHome from "./screen/dashboard/registration/studentRegistrationList/StudentRegistrationListHome.jsx";
import TrainerRegistrationList from "./screen/dashboard/registration/trainerRegistration/TrainerRegistrationList.jsx";
import CreateResult from "./screen/dashboard/CreateResult.jsx";
import CourseList from "./screen/dashboard/course/courseList.jsx";
import CreateQuizHome from "./screen/dashboard/quiz/CreateQuizHome.jsx";
import CreateLevel from "./screen/dashboard/quiz/CreateLevel.jsx";
import CourseListHome from "./screen/dashboard/course/CourseListHome.jsx";
import CourseUpdate from "./screen/dashboard/course/CourseUpdate.jsx";
import StudentRegistrationCourseAndSec from "./screen/dashboard/StudentRegistrationCourseAndSec.jsx";
import UpdateStudentRegistrationForm from "./screen/dashboard/registration/studentRegistrationList/UpdateStudentRegistrationForm";
import TrainerRegistrationListHome from "./screen/dashboard/registration/trainerRegistration/TrainerRegistrationListHome";
import TrainerRegistrationUpdate from "./screen/dashboard/registration/trainerRegistration/TrainerRegistrationUpdate";
import Result from "./screen/Result";
import ShowResultHome from "./screen/dashboard/ShowResult/ShowResultHome";
import UpdateShowResult from "./screen/dashboard/ShowResult/UpdateShowResult";
import ShowResult from "./screen/dashboard/ShowResult/ShowResult";
import EnrolledStudent from "./screen/dashboard/enrolledStudent/EnrolledStudent.jsx";
import AddCountries from "./screen/dashboard/AddCountries.jsx";
import AddCities from "./screen/dashboard/AddCities.jsx"; 
import Branch from "./screen/dashboard/Branch.jsx";
import EnrolledStudentHome from "./screen/dashboard/enrolledStudent/EnrolledStudentHome.jsx";
import UpdateEnrolledStudent from "./screen/dashboard/enrolledStudent/UpdateEnrolledStudent.jsx";
// import Ticket from "./screen/ticket/Ticket.jsx"
import Ticket from "./screen/ticket/Ticket.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useGetUserMutation, setUser } from "./store/store";

import AdminTickets from "./screen/admin-pages/adminTickets/AdminTickets.jsx";
import InstructorCourses from "./screen/instructor-pages/courses/InstructorCourses.jsx";
import InstructorProtectedRoute from "./components/InstructorProtectedRoute.jsx";
import CourseStructure from "./screen/instructor-pages/courses/CourseStructure.jsx";
import CourseMainPage from "./screen/instructor-pages/courses/CourseMainPage.jsx";

import AdminInstructorCourses from "./screen/admin-pages/adminInstructorCourses/AdminInstructorCourses.jsx";
import AdminCourseStructure from "./screen/admin-pages/adminCourseStructure/AdminCourseStructure.jsx";
import AdminCourseMainPage from "./screen/admin-pages/adminCourseMainPage/AdminCourseMainPage.jsx";
import AdminFilteredCourses from "./screen/admin-pages/adminFilteredCoursesPage/AdminFilteredCourses.jsx";
import AdminEnrollmentPage from "./screen/admin-pages/adminEnrollmentPage/AdminEnrollmentPage.jsx";



export default function App() {

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [getUser, getUserResponse] = useGetUserMutation();

  
  useEffect(() => {

    if (user.token && user.user === null) {
      getUser({ token: user.token });
    }

  }, [user]);



  useEffect(() => {

    if (!getUserResponse.isLoading && !getUserResponse.isUninitialized) {

      if (getUserResponse.isError) {

        dispatch(setUser({ user: null, token: null }));

      } else {

        dispatch(
          setUser({ user: { ...getUserResponse.data }, token: user.token })
        );

      }

    }

  }, [getUserResponse]);



 
  return (
    <Router>

      <Routes>
      
        <Route path="/" element={<Boilerplate />}>

          <Route
            index
            element={
                <Home />
            }
          />
          
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />

          <Route
            path="course"
            element={
              <ProtectedRoute>
              
                <Course />
              </ProtectedRoute>
            }
          >
            <Route index element={<CourseHome />} />
            <Route path="course-detail/:courseId" element={<CourseDetail />} />
          </Route>

          <Route
            path="quiz"
            element={
              <ProtectedRoute>
                
                <Quiz />
              </ProtectedRoute>
            }
          >
            <Route index element={<QuizCategory />} />
            <Route path="quiz-level/:id" element={<QuizLevel />} />
            <Route path="display-quiz" element={<DisplayQuiz />} />
          </Route>

          <Route
            path="student-register-form"
            element={<StudentRegisterForm />}
          />

          <Route
            path="trainer-register-form"
            element={<TrainerRegisterForm />}
          />

          <Route path="dashboard" element={<Dashboard />}>

            <Route index element={<DashboardHome />} />
            <Route path="create-course" element={<CreateCourse />} />

            <Route path="create-quiz" element={<CreateQuiz />}>
              <Route index element={<CreateQuizHome />} />
              <Route path="add-level/:id" element={<CreateLevel />} />
            </Route>

            <Route path="course-list" element={<CourseList />}>
              <Route index element={<CourseListHome />} />
              <Route path="course-update" element={<CourseUpdate />} />
            </Route>

            <Route
              path="student-registration-list"
              element={<StudentRegistrationList />}
            >
              <Route index element={<StudentRegistrationListHome />} />

              <Route
                path="update-student-registration-form"
                element={<UpdateStudentRegistrationForm />}
              />
            </Route>

            <Route
              path="trainer-registration-list"
              element={<TrainerRegistrationList />}
            >
              <Route index element={<TrainerRegistrationListHome />} />

              <Route
                path="update-trainer-registration-list-form"
                element={<TrainerRegistrationUpdate />}
              />
            </Route>

            <Route path="create-result" element={<CreateResult />} />

            <Route
              path="student-registration-form-course-and-sec-control"
              element={<StudentRegistrationCourseAndSec />}
            />

            <Route path="show-result" element={<ShowResult />}>
              <Route index element={<ShowResultHome />} />
              <Route path="update-show-result" element={<UpdateShowResult />} />
            </Route>

            <Route path="enrolled-student" element={<EnrolledStudent />}>
              <Route index element={<EnrolledStudentHome />} />

              <Route
                path="update-enrolled-student"
                element={<UpdateEnrolledStudent />}
              />
            </Route>

            <Route path="add-countries" element={<AddCountries />} />

            <Route path="add-cities" element={<AddCities />} />

            <Route path="branch" element={<Branch />} />

            <Route/>

          </Route>

          <Route
            path="result"
            element={
              <ProtectedRoute>
                {" "}
                <Result />{" "}
              </ProtectedRoute>
            }
          />

          <Route
            path="ticket"
            element={
              <ProtectedRoute>
                {" "}
                <Ticket />{" "}
              </ProtectedRoute>
            }
          />


          <Route path="*" element={<Error />} />

          <Route path="admin/tickets" element={<AdminProtectedRoute><AdminTickets/></AdminProtectedRoute> } />
          

          <Route path="admin/instructors/courses" element={<AdminProtectedRoute><AdminInstructorCourses/></AdminProtectedRoute> } />
          <Route path="admin/course/:courseId/structure" element={<InstructorProtectedRoute><AdminCourseStructure/></InstructorProtectedRoute> }/>
          <Route path="admin/course/:courseId/main" element={<ProtectedRoute><AdminCourseMainPage/></ProtectedRoute>  }/>
          <Route path="admin/courses/filtered" element={<AdminProtectedRoute><AdminFilteredCourses/></AdminProtectedRoute>} />
          <Route path="admin/courses/enrolments" element={<AdminProtectedRoute><AdminEnrollmentPage/></AdminProtectedRoute>} />


          <Route path="instructor/courses" element={<InstructorProtectedRoute><InstructorCourses/></InstructorProtectedRoute> }/>
          <Route path="instructor/course/:courseId/structure" element={<InstructorProtectedRoute><CourseStructure/></InstructorProtectedRoute> }/>
          <Route path="instructor/course/:courseId/main" element={<ProtectedRoute><CourseMainPage/></ProtectedRoute>  }/>


        </Route>

      </Routes>

    </Router>
  );
}
