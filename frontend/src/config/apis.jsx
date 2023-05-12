
let baseApi = "";
if(import.meta.env.PROD){
    baseApi="/";
}else{
    baseApi = "http://localhost:3000/";
}

export const login = baseApi + "user/login/";
export const signup = baseApi + "user/signup/";
export const setting = baseApi + "user/setting/";
export const userApi = baseApi + "user/"
export const taskApi = baseApi + "task/";
export const dirApi = baseApi + "dir/";
export const notiApi = baseApi + "noti/";