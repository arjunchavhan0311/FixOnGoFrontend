// services/service-service.js
import { myAxios } from "./helper";

export const createService = (formData) => {
  return myAxios
    .post("/admin/create/service", formData)
    .then(res => res.data);
};

export const getAllServices = () => {
  return myAxios
    .get("/admin/view/service")
    .then(res => res.data);
};
