import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "http://localhost:5002/api",
  withCredentials: true
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or your actual key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);