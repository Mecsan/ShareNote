import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContex } from '../contex/AuthContex'

function Auth() {
    let { auth } = useContext(AuthContex);
    return (
        <>
        {
            !auth && <Navigate to="login"/>
        }
        </>
    )
}

export default Auth