import {
    login as loginApi,
    signup as signupApi,
    userApi
} from "../config/apis";
import { processRequest } from "./processRequest";


export const signup = processRequest( async (body) => {
    let res = await fetch(signupApi, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
    });
    let data = await res.json();
    return data;
})

export const login = processRequest( async (body) => {
    let res = await fetch(loginApi, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
    });
    let data = await res.json();
    return data;
})

export const verify = processRequest(async (token) => {
    let res = await fetch(userApi, {
        headers: {
            'authorization': token
        },
        batchEnable : true
    })
    let data = await res.json();
    return data;
})


