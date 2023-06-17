import React, { useContext } from 'react'
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { AuthContex } from '../contex/AuthContex'
import Nav from './nav';

const SignUpButton = () => {
    return (
        <div className="sign-up-btn">
            <NavLink to='signup'>Signup</NavLink>
        </div>
    )
}

function Auth() {
    let { auth } = useContext(AuthContex);
    return (
        <>
            {
                auth ?
                    <Nav /> : <SignUpButton />
            }
            <Outlet />
        </>
    )
}

export default Auth