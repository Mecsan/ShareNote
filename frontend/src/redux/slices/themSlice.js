import { createSlice } from "@reduxjs/toolkit";

export const themes = Object.freeze({
    LIGHT: "light",
    DARK: "dark"
})

let theme = localStorage.getItem("theme");

let initialState = {
    theme: theme ? theme : themes.LIGHT
}

let themeSlice = createSlice({
    initialState: initialState,
    name: "theme",
    reducers: {
        changeTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem("theme", action.payload)
        }
    }
})

export const { changeTheme } = themeSlice.actions

export default themeSlice.reducer