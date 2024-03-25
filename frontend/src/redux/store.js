import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import noteSlice from "./slices/noteSlice";
import sectionSlice from "./slices/sectionSlice";
import themSlice from "./slices/themSlice";
import headerSlice from "./slices/headerSlice";

let store = configureStore({
  reducer: {
    notes: noteSlice,
    auth: authSlice,
    sections: sectionSlice,
    theme: themSlice,
    header: headerSlice,
  },
});

export default store;
