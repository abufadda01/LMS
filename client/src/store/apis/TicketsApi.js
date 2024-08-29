import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const ticketsApi = createApi({
    reducerPath: "ticketApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
    endpoints: (builder) => ({
        getAllUserTickets: builder.query({
            // ya 7bob send page , limit as a queries
            // /tickets?page=${page}&limit=${limit}
            query: ({token , page}) => ({
                url: `/tickets?page=${page}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            })
        }),
        addNewTicket: builder.mutation({
            query: ({ticket, token}) => {
                console.log(ticket, token);
                return {
                    url: '/tickets/new-ticket',
                    method: 'POST',
                    body: ticket,
                    headers: { Authorization: `Bearer ${token}` }
                }
            }
        }),
        deleteTicket: builder.mutation({
            query: ({ticketId, token}) => ({
                url: `/tickets/delete-ticket/${ticketId}`,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            }),
        }),
    })
})



const {
    useGetAllUserTicketsQuery,
    useAddNewTicketMutation,
    useDeleteTicketMutation,
} = ticketsApi;


export {
    useGetAllUserTicketsQuery,
    useAddNewTicketMutation,
    useDeleteTicketMutation,
    ticketsApi
} 