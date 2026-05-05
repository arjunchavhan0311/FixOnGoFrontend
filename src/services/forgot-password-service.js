import { myAxios } from "./helper";

// ================= SEND OTP =================
export const forgotPassword = (role, email) => {
  return myAxios.post(`/${role}/forgot-password`, { email });
};

// ================= RESET PASSWORD =================
export const resetPassword = (role, data) => {
  return myAxios.post(`/${role}/reset-password`, data);
};