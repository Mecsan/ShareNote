
let baseApi = "";
if(import.meta.env.PROD){
    baseApi="/api/";
}else{
    baseApi = "http://localhost:3000/api/";
}

export const login = baseApi + "user/login/";
export const signup = baseApi + "user/signup/";
export const setting = baseApi + "user/setting/";
export const userApi = baseApi + "user/"
export const noteApi = baseApi + "note/";
export const sectionApi = baseApi + "section/";