import {myAxios} from './helper.js';

export const fetchAllServices = () => {
     return myAxios
    .get("/customer/show/service")
    .then(res => res.data);
};

export const fetchWorkersByCategory = (city, category) => {
  return myAxios
    .get(`/customer/show/worker/${city}/${category}`)
    .then(res => res.data);
};

export const bookService = (formData) => {
  return myAxios
    .post("/customer/service/book", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const getServiceHistory = async (customerId) => {
  const response = await myAxios.get(`/customer/show/service/history/${customerId}`);
  return response.data;
};

