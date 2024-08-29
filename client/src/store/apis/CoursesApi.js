import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const coursesApi = createApi({
    reducerPath: "coursesApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
    endpoints: (builder) => ({
      getAllCourses: builder.query({
        query: ({token , page}) => ({
          url: `/courses?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      getCourseById: builder.query({
        query: ({token , courseId}) => ({
          url: `/courses/${courseId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      courseEnrollment: builder.mutation({
        query: ({token , courseId}) => ({
          url: `/courses/${courseId}`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      reqCourseEnrollment: builder.mutation({
        query: ({token , firstName , lastName , email , phone , city , address , courseId}) => ({
          url: `/student/enroll`,
          method: "POST",
          body : {firstName , lastName , email , phone , city , address , courseId} ,
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      checkEnrolmentStatus: builder.query({
        query: ({token , courseId}) => ({
          url: `/student/check-enrollment/${courseId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
    }),
  });



  const { 
    useGetAllCoursesQuery , 
    useGetCourseByIdQuery ,
    useCourseEnrollmentMutation,
    useReqCourseEnrollmentMutation,
    useCheckEnrolmentStatusQuery
  } = coursesApi;


   export {
      useGetAllCoursesQuery ,
      useGetCourseByIdQuery ,
      useCourseEnrollmentMutation ,
      useReqCourseEnrollmentMutation ,
      useCheckEnrolmentStatusQuery ,
      coursesApi,
    };
