import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    loading: true,
    notes: [],
    copyNote: null
}

let noteSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        startNoteLoad :(state,action)=>{
            state.loading = true;
        },
        stopNoteLoad:(state,action)=>{
            state.loading = false;
        },
        setNotes: (state, action) => {
            state.notes = action.payload;
        },
        addNote: (state, action) => {
            state.notes.push(action.payload);
        },
        deleteNote: (state, action) => {
            state.notes = state.notes.filter(e => e._id != action.payload);
        },
        updateNote: (state, action) => {
            state.notes = state.notes.map(note => {
                if (note._id == action.payload._id)
                    return action.payload
                return note;
            })
        },
        setCopy: (state, action) => {
            state.copyNote = action.payload
        },
        removeCopy: (state, action) => {
            state.copyNote = null;
        }
    }
})

export const {
    setNotes,
    addNote,
    deleteNote,
    updateNote,
    setCopy,
    removeCopy,
    startNoteLoad,
    stopNoteLoad
} = noteSlice.actions

export default noteSlice.reducer