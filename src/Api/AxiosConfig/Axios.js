import axios from "axios";
import { API_URL } from "../../constants/Constants";

export const Axios = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const Axios2 = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const AxiosFormData = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});

// 🔹 Tambahkan Interceptor untuk Semua Instance
const instances = [Axios, Axios2, AxiosFormData];

instances.forEach((instance) => {
  // ✅ Interceptor Request: Tambah Token ke Header
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Tambahkan ke header
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ✅ Interceptor Response: Tangani Token Expired (403 / 401)
  instance.interceptors.response.use(
    (response) => response, // Jika response sukses, langsung return
    (error) => {
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        localStorage.removeItem("token"); // Hapus token dari localStorage
        window.location.href = "/"; // Redirect ke halaman login
      }
      return Promise.reject(error);
    }
  );
});
