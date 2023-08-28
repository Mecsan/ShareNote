import { noteApi } from "../config/apis";

export const createNote = async (sid, token, body) => {
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
}

export const updateNote = async (key, token, body) => {
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
}

export const deleteNote = async (key, token) => {
    let res = await fetch(noteApi + key, {
        method: "DELETE",
        headers: {
            'authorization': token
        }
    })
    let data = await res.json();
    return data;
}

export const getNote = async (key, token) => {
    let option = {};
    if (token) {
        option["headers"] = { 'authorization': token }
    }
    const res = await fetch(noteApi + key, option);
    const data = await res.json();
    return data;
}