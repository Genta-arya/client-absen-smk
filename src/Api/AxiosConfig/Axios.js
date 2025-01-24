import axios from "axios";
import { API_URL } from "../../constants/Constants";

export const Axios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance untuk Form Data
export const AxiosFormData = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Interceptor untuk menambahkan token secara dinamis
const addAuthToken = (config) => {
  const token = localStorage.getItem("token"); // Ambil token dari localStorage atau sumber lain
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Tambahkan interceptor ke kedua instance
Axios.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
AxiosFormData.interceptors.request.use(addAuthToken, (error) =>
  Promise.reject(error)
);
