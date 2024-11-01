import { noteApi } from "../config/apis";
import { startNoteLoad, stopNoteLoad } from "../redux/slices/noteSlice";
import { processRequest } from "./processRequest";

export const createNote = processRequest(async (sid, token, body) => {
    let res = await fetch(noteApi + sid, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
            'Authorization': token
        },
        body: JSON.stringify(body)
    })

    let data = await res.json();
    return data;
})

export const updateNote = processRequest(async (key, token, body) => {
    let res = await fetch(noteApi + key, {
        method: "PUT",
        headers: {
            'authorization': token,
            'Content-Type': "application/json"
        },
        body: JSON.stringify(body)
    })
    let data = await res.json();
    return data;
})

export const deleteNote = processRequest(async (key, token) => {
    let res = await fetch(noteApi + key, {
        method: "DELETE",
        headers: {
            'authorization': token
        }
    })
    let data = await res.json();
    return data;
})

export const getNote = processRequest(async (key, token,dispatch) => {
    let option = {
        batchEnable: true,
    };
    if (token) {
        option["headers"] = { 'authorization': token }
    }
    dispatch(startNoteLoad());
    const res = await fetch(noteApi + key, option);
    const data = await res.json();
    dispatch(stopNoteLoad());
    return data;
})