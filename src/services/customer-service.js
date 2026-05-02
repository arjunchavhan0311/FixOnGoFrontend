import {myAxios} from './helper.js';

export const signUp=(customer)=>{
    return myAxios
    .post('/customer/signup', customer)
    .then(response=>response.data);
}

export const logIn=(loginData)=>{
    return myAxios
    .post('/customer/login', loginData)
    .then(response=>response.data);
}

export const getCustomerByEmail = (email) => {
  return myAxios
    .get(`/customer/profile/${email}`)
    .then(res => res.data);
};

export const getCustomerServiceHistory = (customerId) => {
  return myAxios
    .get(`/customer/show/service/history/${customerId}`)
    .then(res => res.data);
};

