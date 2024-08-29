import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { 
    useGetAllTicketsAdminQuery , 
    useGetFilteredTicketsAdminQuery , 
     }
from "../../../store/store";

import {fetchTicketsSuccess} from "../../../store/slices/adminSlice"
import AdminTicketComponent from "../../../components/AdminTicketComponent";
import "./index.css"

import { useGetAllUsersQuery } from "../../../store/apis/AdminApi";



const AdminTickets = () => {

    const [filters, setFilters] = useState({
        status: '',
        regarding: '',
        userId: '',
        page: 1,
    });

    const dispatch = useDispatch()

    const { token } = useSelector((state) => state.user);
    const { tickets , totalPages , currentPage } = useSelector((state) => state.admin);

    const { data , error , isLoading } = useGetFilteredTicketsAdminQuery({ ...filters , token });
    const { data : usersData , error : usersError , isLoading : usersLoading } = useGetAllUsersQuery({ token , page : filters.page });

    
    
    useEffect(() => {
        if (data) {
            dispatch(fetchTicketsSuccess(
                {
                    tickets : data.tickets , 
                    totalPages : data.totalPages , 
                    currentPage : data.currentPage
                }
            ));
        }
    } , [data , dispatch])



    const handleInputChange = (e) => {
        const { name , value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };


    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setFilters({
            ...filters,
            page: 1,
        });
    };


    const handlePageChange = (newPage) => {
        setFilters({
            ...filters,
            page: newPage,
        });
    };


    const resetFilter = () => {
        setFilters({page : 1 , status : "" , regarding : "" , userId : ""})
    }
    


    return (

        <div>

            <form onSubmit={handleFilterSubmit} className="filter-form">

                <select name="status" value={filters.status} onChange={handleInputChange}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="inProgress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>

                <select name="regarding" value={filters.regarding} onChange={handleInputChange}>
                    <option value="">All Regarding</option>
                    <option value="content">Content</option>
                    <option value="technical">Technical</option>
                </select>

                <select name="userId" value={filters.userId} onChange={handleInputChange}>
                    {usersData && usersData?.users?.map((user) => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                </select>

                <button type="submit">Filter</button>

                <button onClick={resetFilter}>reset filter</button>

            </form>


            <div style={{display : "flex" , flexWrap : "wrap" , alignItems : "flex-start"}}>
                {tickets && tickets?.map((ticket) => (
                    <AdminTicketComponent key={ticket._id} ticket={ticket}/>
                ))}
            </div>
            

            <div className="pagination">

                {Array.from({ length: totalPages || 1 } , (_ , i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        disabled={filters.page === i + 1}
                    >
                        {i + 1}

                    </button>
                ))}

            </div>

        </div>
    )
}


export default AdminTickets