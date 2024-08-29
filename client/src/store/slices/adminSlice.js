import { createSlice } from '@reduxjs/toolkit';


const adminSlice = createSlice({
  name: 'adminSlice',
  initialState : {
    tickets: [],
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    fetchTicketsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTicketsSuccess(state, action) {
      state.tickets = action.payload.tickets;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    updateTicketStatus(state, action) {
      const { ticketId, newStatus } = action.payload;
      const ticket = state.tickets.find(ticket => ticket._id === ticketId);
      if (ticket) {
        ticket.status = newStatus;
      }
    },
    updateSupportResponse(state, action) {
      const { ticketId , supportText } = action.payload;
      const ticket = state.tickets.find(ticket => ticket._id === ticketId);
      if (ticket) {
        ticket.supportTeamResponse = supportText;
      }
    },
    fetchTicketsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addNewTicketStart(state) {
      state.loading = true;
      state.error = null;
    },
    addNewTicketSuccess(state, action) {
      state.loading = false;
      state.tickets.push(action.payload);
    },
    addNewTicketFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTicketStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteTicketSuccess(state, action) {
      state.loading = false;
      state.tickets = state.tickets.filter(ticket => ticket._id !== action.payload);
    },
    deleteTicketFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});



const {
  fetchTicketsStart,
  fetchTicketsSuccess,
  fetchTicketsFailure,
  addNewTicketStart,
  addNewTicketSuccess,
  addNewTicketFailure,
  deleteTicketStart,
  deleteTicketSuccess,
  deleteTicketFailure,
  updateTicketStatus,
  updateSupportResponse
} = adminSlice.actions;



export {
  fetchTicketsStart,
  fetchTicketsSuccess,
  fetchTicketsFailure,
  addNewTicketStart,
  addNewTicketSuccess,
  addNewTicketFailure,
  deleteTicketStart,
  deleteTicketSuccess,
  deleteTicketFailure,
  updateTicketStatus,
  updateSupportResponse,
  adminSlice
};