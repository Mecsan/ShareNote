import { createSlice } from "@reduxjs/toolkit";

export const status = Object.freeze({
    UNVERIFIED: "unverified",
    AUTH: "autheticated",
    NOAUTH: "unauthenticated",
})

let token = localStorage.getItem("noteAuth");

let initialState = {
    token: token ? token : null,
    user: null,
    authStatus: status.UNVERIFIED
}

let authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setStatus: (state, action) => {
            state.authStatus = action.payload
        },
        logout: (state, action) => {
            state.token = null;
            state.user = null;
            state.authStatus = status.NOAUTH
        }
    }
})

export const {
    login,
    setStatus,
    logout,
    setUser
} = authSlice.actions

export default authSlice.reducer