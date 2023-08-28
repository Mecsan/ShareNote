import {
    login as loginApi,
    setting,
    signup as signupApi,
    userApi
} from "../config/apis";


export const signup = async (body) => {
    let res = await fetch(signupApi, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
    });
    let data = await res.json();
    return data;
}

export const login = async (body) => {
    let res = await fetch(loginApi, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
    });
    let data = await res.json();
    return data;
}

export const verify = async (token) => {
    let res = await fetch(userApi, {
        headers: {
            'authorization': token
        }
    })
    let data = await res.json();
    return data;
}

export const changeSetting = async (token,body) => {
    let res = await fetch(setting, {
        method: "POST",
        headers: {
            'authorization': token,
            'content-type': "application/json"
        },
        body: JSON.stringify(body)
    })
    let data = await res.json();
    return data;
}
