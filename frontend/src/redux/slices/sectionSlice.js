import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    loading: true,
    sections: []
}

let sectionSlice = createSlice({
    name: "sections",
    initialState,
    reducers: {
        startSectionLoad :(state,action)=>{
            state.loading = true
        },
        stopSectionLoad :(state,action)=>{
            state.loading = false
        },
        setSections: (state, action) => {
            state.sections = action.payload;
        },
        addSection: (state, action) => {
            state.sections.push(action.payload);
        },
        deleteSection: (state, action) => {
            state.sections = state.sections.filter(e => e._id != action.payload);
        },
        updateSection: (state, action) => {
            state.sections = state.sections.map(section => {
                if (section._id == action.payload._id)
                    return { ...section, ...action.payload }
                return section;
            })
        }
    }
})

export const {
    setSections,
    addSection,
    deleteSection,
    updateSection,
    startSectionLoad,
    stopSectionLoad
} = sectionSlice.actions

export default sectionSlice.reducer