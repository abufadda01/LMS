import React from 'react'
import { Navigate} from "react-router-dom";
import { useSelector } from "react-redux";



const InstructorProtectedRoute = ({children}) => {

    const userSlice = useSelector((state) => state.user);

    const { user, token } = userSlice;

    if((user?.role === "instructor" || user?.role === "admin") && token){
        return children
    }

}


export default InstructorProtectedRoute
