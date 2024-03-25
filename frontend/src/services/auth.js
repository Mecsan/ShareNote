import {
    login as loginApi,
    setting,
    signup as signupApi,
    userApi
} from "../config/apis";
import { handleError } from "./errorHandler";


export const signup = handleError( async (body) => {
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

export const login = handleError( async (body) => {
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

export const verify = handleError(async (token) => {
    let res = await fetch(userApi, {
        headers: {
            'authorization': token
        }
    })
    let data = await res.json();
    return data;
})


