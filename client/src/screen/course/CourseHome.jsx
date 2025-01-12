import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { getItem } from "../../config/FirebaseMethods";

import "../../style/course.scss";

export default function CourseHome() {
  let [data, setData] = useState([
    
    {
    image:"https://tecdn.b-cdn.net/img/new/standard/city/044.webp",
    courseName:"akour",
    courseDuration:"oihoi",
    noOfQuiz:"oiuhoi",
    price:"56156"
  },
    {
    image:"https://tecdn.b-cdn.net/img/new/standard/city/044.webp",
    courseName:"allijh",
    courseDuration:"oihoi",
    noOfQuiz:"oiuhoi",
    price:"56156"
  },

]);
  let navigate = useNavigate();

  // useEffect(() => {
  //   getItem("course")
  //     .then((_) => {
  //       let arr = Object.values(_).filter((value, index) => {
  //         if (value.isPubliclyOpen === "yes") {
  //           return value;
  //         }
  //       });
  //       setData(arr);
  //       console.log(arr);
  //     })
  //     .catch((_) => console.log(_));
  // }, [0]);

  return (
    <div className="course">
      <div className="heading">
        <h1>Course</h1>
      </div>

      <div className="box">
        {data && data.length > 0 ? (
          data.map((value, index) => {
            return (
              <div
                key={index}
                className="box1"
                onClick={() => navigate("course-detail", { state: value })}
              >
                <img src={value.image} alt="image not found" width="300px" />
                <div className="description">
                  <h1>{value.courseName}</h1>
                  <p>Course duration: {value.courseDuration} Month</p>
                  <p>no. of Quiz: {value.noOfQuiz}</p>
                  <h2>JO {value.price}</h2>
                  <button>Enroll</button>
                </div>
              </div>
            );
          })
        ) : (
          <p>Empty</p>
        )}
      </div>
    </div>
  );
}
