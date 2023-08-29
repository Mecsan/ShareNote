import React, { useContext } from 'react'
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { status } from '../redux/slices/authSlice';
import Nav from './nav';

const SignUpButton = () => {
    return (
        <div className="sign-up-btn">
            <NavLink to='signup'>Signup</NavLink>
        </div>
    )
}

function Auth() {
    let { authStatus } = useSelector(state => state.auth);
    return (
        <>
            {
                authStatus == status.AUTH ?
                    <Nav /> :
                    <SignUpButton />
            }
            <Outlet />
        </>
    )
}

export default Auth