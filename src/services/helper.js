import axios from "axios";

export const BASE_URL = "http://localhost:8080/api";

export const myAxios = axios.create({
  baseURL: BASE_URL,
});

myAxios.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("fixongo_auth");

    if (auth) {
      try {
        const { token } = JSON.parse(auth);

        if (token && token.startsWith("ey")) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Invalid auth object");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);
