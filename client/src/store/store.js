import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import {
  authApi,
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserMutation,
} from "./apis/AuthApi";

import {
  ticketsApi,
  useGetAllUserTicketsQuery,
  useAddNewTicketMutation,
  useDeleteTicketMutation,
} from "./apis/TicketsApi";

import {
  instructorApi,
  useGetInstructorCoursesQuery
} from "./apis/InstructorApi";

import {
  coursesApi
} from "./apis/CoursesApi"


import { userSlice, setUser, logout } from "./slices/userSlice";

import { instructorSlice } from "./slices/instructorSlice";

import {
  ticketSlice,
  fetchTicketsStart,
  fetchTicketsSuccess,
  fetchTicketsFailure,
  addNewTicketStart,
  addNewTicketSuccess,
  addNewTicketFailure,
  deleteTicketStart,
  deleteTicketSuccess,
  deleteTicketFailure,
} from "./slices/TicketSlice";


import {
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
} from "./apis/AdminApi";

import { adminSlice } from "./slices/adminSlice";


const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    tickets: ticketSlice.reducer,
    admin : adminSlice.reducer,
    instructor : instructorSlice.reducer,
    [coursesApi.reducerPath] : coursesApi.reducer ,
    [ticketsApi.reducerPath]: ticketsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [instructorApi.reducerPath]: instructorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(ticketsApi.middleware)
      .concat(adminApi.middleware)
      .concat(instructorApi.middleware)
      .concat(coursesApi.middleware),
  devTools: true,
});


setupListeners(store.dispatch);


export {
  store,
  setUser,
  logout,
  fetchTicketsStart,
  fetchTicketsSuccess,
  fetchTicketsFailure,
  addNewTicketStart,
  addNewTicketSuccess,
  addNewTicketFailure,
  deleteTicketStart,
  deleteTicketSuccess,
  deleteTicketFailure,
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetAllUserTicketsQuery,
  useAddNewTicketMutation,
  useDeleteTicketMutation,
  useGetAllTicketsAdminQuery,
  useChangeTicketStatusAdminMutation,
  useSupportTeamResponseAdminMutation,
  useGetFilteredTicketsAdminQuery,
  useDeleteTicketAdminMutation,
  useGetAllInstructorsAdminQuery,
  useGetInstructorCoursesAdminQuery,
  useGetStudentsInCourseAdminQuery,
  useGetAllCoursesAdminQuery,
  useGetUserMutation,
  useGetInstructorCoursesQuery
};
