
import React, { createContext, useEffect, useState } from 'react'
import { userApi } from '../config/apis';
import { verify } from '../services/auth';

export const AuthContex = createContext();

export default function AuthProvider(props) {

    const [auth, setauth] = useState(localStorage.getItem("noteAuth"));
    let [user, setuser] = useState(null);
    const [loading, setloading] = useState(false);

    let fetchUserinfo = async () => {

        if (!auth) {
            setuser(null);
            setauth(null);
            return;
        }

        // validating the token 
        setloading(true)

        let data = await verify(auth);
        if (data.success) {
            setuser(data.msg);
        } else {
            localStorage.removeItem('noteAuth');
            setauth(null)
        }
        setloading(false);
    }

    useEffect(() => {
        fetchUserinfo();
    }, [auth])
    return (
        <AuthContex.Provider value={{ auth, setauth, user, setuser, loading }}>
            {props.children}
        </AuthContex.Provider>
    )
}
