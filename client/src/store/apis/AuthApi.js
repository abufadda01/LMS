import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUser: builder.mutation({
      query: ({ token }) => {
        return {
          url: "/auth/get-user",
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        };
      },
    }),
  }),
});



const { 
     useLoginUserMutation,
     useRegisterUserMutation,
     useGetUserMutation 
    } = authApi;


    
export {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserMutation,
  authApi,
};
