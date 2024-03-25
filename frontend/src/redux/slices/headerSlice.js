import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  loading: true,
  data: {},
};

let headerSlice = createSlice({
  initialState: initialState,
  name: "header",
  reducers: {
    changeHeader: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { changeHeader } = headerSlice.actions;

export default headerSlice.reducer;
