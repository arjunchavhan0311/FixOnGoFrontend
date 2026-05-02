import {myAxios} from './helper.js';

export const signUp=(admin)=>{
    return myAxios
    .post('/admin/signup', admin)
    .then(response=>response.data);
}

export const logIn=(loginData)=>{
    return myAxios
    .post('/admin/login', loginData)
    .then(response=>response.data);
}

export const profile=(email)=>{
    return myAxios
    .get(`/admin/profile/${email}`)
    .then(response=>response.data);
}

export const updateProfile=(email,adminProfile)=>{
    return myAxios
    .put(`/admin/update/${email}`, adminProfile)
    .then(response=>response.data);
}

export const getAllServiceHistory = () => {
  return myAxios
    .get("/admin/view/service/history")
    .then((response) => response.data);
};