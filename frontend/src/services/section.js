import { sectionApi } from "../config/apis";
import { handleError } from "./errorHandler";

export const createSection = handleError(async (token, body) => {
    let res = await fetch(sectionApi, {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            'Authorization': token
        },
        body: JSON.stringify(body)
    })

    let data = await res.json();
    return data;
})

export const getSections = handleError(async (token) => {
    let res = await fetch(sectionApi, {
        headers: {
            'Authorization': token
        }
    });
    let data = await res.json();
    return data;
})

export const getSection = handleError(async (token, sid) => {
    const option = {}
    if (token) {
        option["headers"] = { 'authorization': token }
    }
    let res = await fetch(sectionApi + sid, option);
    let data = await res.json();
    return data;
})

export const updateSection = handleError(async (token, sid, body) => {
    let res = await fetch(sectionApi + sid, {
        method: "PUT",
        headers: {
            'authorization': token,
            'Content-Type': "application/json"
        },
        body: JSON.stringify(body)
    });

    let data = await res.json();
    return data;
})

export const deleteSection = handleError(async (token, sid) => {
    let res = await fetch(sectionApi + sid, {
        method: "DELETE",
        headers: {
            'authorization': token
        }
    })
    let data = await res.json();
    return data;
})

export const copySection = handleError(async (token, sid) => {
    let res = await fetch(sectionApi + "copy/" + sid, {
        headers: {
            "authorization": token
        }
    });
    let data = await res.json();
    return data;
})