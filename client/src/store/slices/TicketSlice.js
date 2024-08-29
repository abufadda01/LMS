import { createSlice } from '@reduxjs/toolkit';

const ticketSlice = createSlice({
  name: 'ticketSlice',
  initialState: {
    tickets: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchTicketsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTicketsSuccess(state, action) {
      state.loading = false;
      state.tickets = action.payload;
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
      state.tickets = state.tickets.filter(ticket => ticket.id !== action.payload);
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
} = ticketSlice.actions;



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
  ticketSlice
};