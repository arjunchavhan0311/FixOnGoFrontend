// services/otp-service.js
import { myAxios } from "./helper";

// 🔹 Send OTP
export const sendOtp = (serviceId) => {
  return myAxios
    .post(`/service/send-otp/${serviceId}`)
    .then(res => res.data);
};

// 🔹 Verify OTP
export const verifyOtp = (data) => {
  return myAxios
    .post(`/service/verify-otp`, data)
    .then(res => res.data);
};