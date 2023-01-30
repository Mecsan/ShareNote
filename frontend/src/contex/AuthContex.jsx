
import React, { createContext, useState } from 'react'

export const AuthContex = createContext();

export default function AuthProvider(props) {

    const [auth, setauth] = useState(localStorage.getItem("taskAuth"));

    return (
        <AuthContex.Provider value={{ auth, setauth }}>
            {props.children}
        </AuthContex.Provider>
    )
}
