import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const instructorApi = createApi({
  reducerPath: "instructorApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    getInstructorCourses: builder.query({
      query: ({page , token}) => ({
        url: `/instructor/all-instructor-courses?page=${page}`,
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      }),
    }),
    getCourseById: builder.query({
      query: ({courseId , token}) => ({
        url: `/instructor/get-course/${courseId}`,
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      }),
    }),
    createNewCourse: builder.mutation({
      query: ({token , title , startDate , endDate}) => ({
        url: "/instructor/create-course",
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body : {title , startDate , endDate}
      }),
    }),
    updateCourseSections: builder.mutation({
      query: ({ token, courseId, sections }) => ({
        url: `/instructor/update-course-sections/${courseId}`,
        headers: { Authorization: `Bearer ${token}` },
        method: "PUT",
        body: { sections },
      }),
    }),
    deleteCourseSection: builder.mutation({
      query: ({ token, courseId , sectionId}) => ({
        url: `/instructor/delete-course-sections/${courseId}/${sectionId}`,
        headers: { Authorization: `Bearer ${token}` },
        method: "PUT",
      }),
    }),
    deleteCourseItem: builder.mutation({
      query: ({ token, courseId , sectionId , itemId}) => ({
        url: `/instructor/delete-course-item/${courseId}/${sectionId}/${itemId}`,
        headers: { Authorization: `Bearer ${token}` },
        method: "PUT",
      }),
    }),
    uploadActivity: builder.mutation({
      query: ({ courseId, sectionId, itemId, attachment, token }) => {
        const formData = new FormData();
        formData.append('activityFile', attachment);
        return {
          url: `/attachment/${courseId}/${sectionId}/${itemId}`,
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
  }),
});



const { 
    useGetInstructorCoursesQuery,
    useCreateNewCourseMutation,
    useGetCourseByIdQuery,
    useUpdateCourseSectionsMutation,
    useDeleteCourseSectionMutation,
    useDeleteCourseItemMutation,
    useUploadActivityMutation
    } = instructorApi;


export {
    useGetInstructorCoursesQuery,
    useCreateNewCourseMutation,
    useGetCourseByIdQuery,
    useUpdateCourseSectionsMutation,
    useDeleteCourseSectionMutation,
    useDeleteCourseItemMutation,
    useUploadActivityMutation,
  instructorApi,
};
