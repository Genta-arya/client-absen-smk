import axios from "axios";
import { API_URL } from "../../constants/Constants";

export const Axios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const AxiosFormData = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});


const addAuthToken = (config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};


Axios.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
AxiosFormData.interceptors.request.use(addAuthToken, (error) =>
  Promise.reject(error)
);
