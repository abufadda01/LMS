import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const ticketsApi = createApi({
    reducerPath: "ticketApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
    endpoints: (builder) => ({
        addTracking: builder.mutation({
            query: ({token , attachmentId , questions , endingTime , startingTime}) => ({
                url: `/tracking/${attachmentId}`,
                method: 'POST',
                body : {questions , endingTime , startingTime} ,
                headers: { Authorization: `Bearer ${token}` }
            })
        }),
        getUserTracking: builder.query({
            query: ({token , page , passStatus , userId , markRange , completed}) => ({
                url: `/tracking/?page=${page}&passStatus=${passStatus}&userId=${userId}&markRange=${markRange}&completed=${completed}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            })
        }),
        deleteTracking: builder.mutation({
            query: ({token , trackId}) => ({
                url: `/tracking/${trackId}`,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
        }),
    })
})




const {
    useAddTrackingMutation,
    useGetUserTrackingQuery,
    useDeleteTrackingMutation
} = ticketsApi;


export {
    useAddTrackingMutation,
    useGetUserTrackingQuery,
    useDeleteTrackingMutation,
    ticketsApi
} 