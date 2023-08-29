import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import noteSlice from "./slices/noteSlice";
import sectionSlice from "./slices/sectionSlice";

let store = configureStore({
    reducer: {
        notes: noteSlice,
        auth: authSlice,
        sections: sectionSlice
    }
})

export default store