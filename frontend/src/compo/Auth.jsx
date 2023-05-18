import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContex } from '../contex/AuthContex'
import Nav from './nav';

function Auth() {
    let { auth } = useContext(AuthContex);
    return (
        <>
            {
                auth ?
                    <Nav /> : null
            }
            <Outlet />
        </>
    )
}

export default Auth