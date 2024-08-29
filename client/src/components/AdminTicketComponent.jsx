import React, { useState } from 'react'
import "../style/adminTicket.css"
import { useChangeTicketStatusAdminMutation , useDeleteTicketAdminMutation, useSupportTeamResponseAdminMutation } from '../store/store';
import { useSelector , useDispatch  } from 'react-redux';
import { updateTicketStatus , updateSupportResponse , deleteTicketSuccess } from '../store/slices/adminSlice';




const AdminTicketComponent = ({ticket}) => {

    const [newTicketStatus , setNewTicketStatus] = useState(ticket?.status);
    const [supportText , setSupportText] = useState(ticket?.supportTeamResponse || '');

    const [changeTicketStatusAdmin, { error: statusError, isLoading: statusLoading }] = useChangeTicketStatusAdminMutation();
    const [supportTeamResponseAdmin, { error: responseError, isLoading: responseLoading }] = useSupportTeamResponseAdminMutation();
    const [deleteTicketAdmin, { error : deleteError, isLoading : deleteLoading }] = useDeleteTicketAdminMutation();
    

    const { token } = useSelector((state) => state.user);
    const dispatch = useDispatch()


    const handleStatusChange = async (ticketId) => {
        try {
            await changeTicketStatusAdmin({newTicketStatus , ticketId , token}).unwrap()
            dispatch(updateTicketStatus({ ticketId, newStatus: newTicketStatus }));
        } catch (error) {
            console.log(error)
        }
    };


    const handleSupportResponseChange = async (ticketId) => {
        try {
            await supportTeamResponseAdmin({ ticketId, supportText, token }).unwrap();
            dispatch(updateSupportResponse({ ticketId , supportText }));
        } catch (error) {
            console.log(error);
        }
    };


    const handleDeleteTicket = async (ticketId) => {
        try {
            await deleteTicketAdmin({ ticketId, token }).unwrap();
            dispatch(deleteTicketSuccess(ticketId));
        } catch (error) {
            console.log(error);
        }
    };




  return (

    <div className="tickets-container">

            <div key={ticket?._id} className="ticket-card">

                <h3>{ticket?.subject}</h3>
                <p><strong>username : </strong> {ticket?.userObjRef.name}</p>
                <p><strong>email : </strong> {ticket?.userObjRef.email}</p>
                <p><strong>Subject : </strong> {ticket?.subject}</p>
                <p><strong>Details : </strong> {ticket?.details}</p>
                <p><strong>Info : </strong> {ticket?.info}</p>
                <p><strong>Regarding:</strong> {ticket?.regarding}</p>
                <p><strong>Status</strong> <span className={`status ${ticket?.status.toLowerCase()}`}>{ticket.status}</span></p>
                <p><strong>Support Team Response : </strong> {ticket?.supportTeamResponse}</p>
                
                <div className="status-change">

                    <select value={newTicketStatus} onChange={(e) => setNewTicketStatus(e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="inProgress">In Progress</option>
                        <option value="closed">Closed</option>
                    </select>

                </div>            

                <button disabled={ticket?.status === newTicketStatus || statusLoading} onClick={() => handleStatusChange(ticket?._id)}>
                    {statusLoading ? 'Updating...' : 'Change Ticket Status'}                    
                </button>

                {statusError && <p className="error">{error.data.message}</p>}

                <div className="support-response">

                    <textarea
                        value={supportText}
                        onChange={(e) => setSupportText(e.target.value)}
                        maxLength={300}
                        placeholder="Enter support team response"
                    />

                    {responseError && <p className="error">{responseError.data.message}</p>}
                
                </div>
          
                <button disabled={responseLoading || supportText === ""} onClick={() => handleSupportResponseChange(ticket?._id)}>
                    {responseLoading ? 'Updating...' : 'change suport team Response'}
                </button>

                <button onClick={() => handleDeleteTicket(ticket?._id)} style={{marginLeft : "10px"}}>
                    {deleteLoading ? 'Deleting...' : 'delete ticket'}
                </button>

            </div>

        </div>
    )
}

export default AdminTicketComponent