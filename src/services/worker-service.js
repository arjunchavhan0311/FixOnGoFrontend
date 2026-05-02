import {myAxios} from './helper.js';

export const signUp = (formData) => {
  return myAxios.post("/worker/signup", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }).then(res => res.data);
};


export const logIn=(loginData)=>{
    return myAxios
    .post('/worker/login', loginData)
    .then(response=>response.data);
}

// Get all services for worker
export const getWorkerServices = (workerId) => {
  return myAxios
    .get(`/worker/show/services/${workerId}`)
    .then(res => res.data);
};

// Update service status
export const updateServiceStatus = (status, serviceId) => {
  return myAxios
    .put(`/worker/update/service/status/${status}/${serviceId}`)
    .then(res => res.data);
};
