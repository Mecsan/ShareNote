import { sectionApi } from "../config/apis";
import { startSectionLoad, stopSectionLoad } from "../redux/slices/sectionSlice";
import { processRequest } from "./processRequest";

export const createSection = processRequest(async (token, body) => {
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

export const getSections = processRequest(async (token) => {
    let res = await fetch(sectionApi, {
        headers: {
            'Authorization': token
        },
        batchEnable: true
    });
    let data = await res.json();
    return data;
})

export const getSection = processRequest(async (token, sid, query, dispatch) => {
    const option = {
        batchEnable: true,
    }
    if (token) {
        option["headers"] = { 'authorization': token }
    }
    dispatch(startSectionLoad());
    let res = await fetch(sectionApi + sid + "?search=" + query, option);
    let data = await res.json();
    dispatch(stopSectionLoad());
    return data;
})

export const updateSection = processRequest(async (token, sid, body) => {
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

export const deleteSection = processRequest(async (token, sid) => {
    let res = await fetch(sectionApi + sid, {
        method: "DELETE",
        headers: {
            'authorization': token
        }
    })
    let data = await res.json();
    return data;
})

export const copySection = processRequest(async (token, sid) => {
    let res = await fetch(sectionApi + "copy/" + sid, {
        headers: {
            "authorization": token
        }
    });
    let data = await res.json();
    return data;
})