import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/admin" }),
  endpoints: (builder) => ({
    getAllTicketsAdmin: builder.query({
      query: ({ page, token }) => {
        return {
          url: `/tickets?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    changeTicketStatusAdmin: builder.mutation({
      query: ({ newTicketStatus, ticketId , token }) => {
        return {
          url: `/tickets/${ticketId}`,
          method: "PATCH",
          body: {newTicketStatus},
          headers: { Authorization: `Bearer ${token}` }
        };
      },
    }),
    supportTeamResponseAdmin: builder.mutation({
      query: ({ token, ticketId, supportText }) => {
        return {
          url: `/tickets/${ticketId}/support`,
          method: "POST",
          body: { supportText },
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    getFilteredTicketsAdmin: builder.query({
      query: ({ token , status , regarding , userId , page }) => {
        return {
          url: `/tickets/filtered?page=${page}&status=${status}&regarding=${regarding}&userId=${userId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    deleteTicketAdmin: builder.mutation({
      query: ({ ticketId, token }) => {
        return {
          url: `/tickets/${ticketId}`,
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    getAllInstructorsAdmin: builder.query({
      query: ({ token , page }) => {
        return {
          url: `/instructor?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    getInstructorCoursesAdmin: builder.query({
      query: ({ token, instructorId, page }) => {
        return {
          url: `/instructor/${instructorId}/courses?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    getStudentsInCourseAdmin: builder.query({
      query: ({ instructorId, courseId, token, page }) => {
        return {
          url: `/instructor/${instructorId}/courses/${courseId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          query: { page },
        };
      },
    }),
    getAllCoursesAdmin: builder.query({
      query: ({ token , page }) => {
        return {
          url: "/courses",
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          query: { page },
        };
      },
    }),
    getAllUsers: builder.query({
      query: ({ token , page }) => {
        return {
          url: `/users?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    uploadAttachmentAdmin: builder.mutation({
      query: ({ courseId, sectionId, itemId, attachment, attachment_name, type, token }) => {
 
        const formData = new FormData();
        formData.append('activityFile', attachment);

        return {
          url: `/courses/${courseId}/sections/${sectionId}/items/${itemId}/attachments`,
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    deleteAttachmentAdmin: builder.mutation({
      query: ({ courseId, sectionId, itemId, attachmentId, token }) => {
        return {
          url: `/courses/${courseId}/sections/${sectionId}/items/${itemId}/attachments/${attachmentId}`,
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    addSectionToCourseFun: builder.mutation({
      query: ({ courseId , token , name , items }) => {
        return {
          url: `add-course-section/${courseId}`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body : {name , items} 
        };
      },
    }),
    addItemToSectionFun: builder.mutation({
      query: ({ courseId , sectionId , token , name , attachments , type }) => {
        return {
          url: `/courses/${courseId}/sections/${sectionId}/items`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body : {name , attachments , type} 
        };
      },
    }),
    deletCourse: builder.mutation({
      query: ({ courseId , token }) => {
        return {
          url: `/courses/${courseId}`,
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    getFilterdCourses: builder.query({
      query: ({ token , page , instructorId , noInstructor , startDate , endDate , title , minRate , maxRate }) => {
        return {
          url: `/courses/filtered?page=${page}&instructorId=${instructorId}&noInstructor=${noInstructor}&startDate=${startDate}&endDate=${endDate}&title=${title}&minRate=${minRate}&maxRate=${maxRate}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    assignCourseToAdmin: builder.mutation({
      query: ({ courseId , token }) => {
        return {
          url: `/courses/assign/${courseId}`,
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    deleteInstructor: builder.mutation({
      query: ({ instructorId , token }) => {
        return {
          url: `/instructor/${instructorId}`,
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
    }),
    updateEnrolmentStatus: builder.mutation({
      query: ({ courseId , studentId , token , newStatus  }) => {
        return {
          url: `/student/update-enrolment-status/${courseId}/${studentId}`,
          method: "PATCH",
          body : {newStatus} ,
          headers: { Authorization: `Bearer ${token}`},
        };
      },
    }),
    getAllEnrolmentsReq: builder.query({
      query: ({ token }) => {
        return {
          url: `/student/all-enrolments`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}`},
        };
      },
    }),
  }),
});




const {
  useGetAllTicketsAdminQuery,
  useChangeTicketStatusAdminMutation,
  useSupportTeamResponseAdminMutation,
  useGetFilteredTicketsAdminQuery,
  useDeleteTicketAdminMutation,
  useGetAllInstructorsAdminQuery,
  useGetInstructorCoursesAdminQuery,
  useGetStudentsInCourseAdminQuery,
  useGetAllCoursesAdminQuery,
  useGetAllUsersQuery,
  useUploadAttachmentAdminMutation,
  useDeleteAttachmentAdminMutation,
  useAddSectionToCourseFunMutation,
  useAddItemToSectionFunMutation,
  useDeletCourseMutation,
  useGetFilterdCoursesQuery ,
  useAssignCourseToAdminMutation,
  useDeleteInstructorMutation,
  useUpdateEnrolmentStatusMutation ,
  useGetAllEnrolmentsReqQuery
} = adminApi;



export {
  adminApi,
  useGetAllTicketsAdminQuery,
  useChangeTicketStatusAdminMutation,
  useSupportTeamResponseAdminMutation,
  useGetFilteredTicketsAdminQuery,
  useDeleteTicketAdminMutation,
  useGetAllInstructorsAdminQuery,
  useGetInstructorCoursesAdminQuery,
  useGetStudentsInCourseAdminQuery,
  useGetAllCoursesAdminQuery,
  useGetAllUsersQuery,
  useUploadAttachmentAdminMutation,
  useDeleteAttachmentAdminMutation,
  useAddSectionToCourseFunMutation,
  useAddItemToSectionFunMutation,
  useDeletCourseMutation,
  useGetFilterdCoursesQuery,
  useAssignCourseToAdminMutation,
  useDeleteInstructorMutation ,
  useGetAllEnrolmentsReqQuery,
  useUpdateEnrolmentStatusMutation
};
