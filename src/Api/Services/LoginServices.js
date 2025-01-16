import { Axios } from "../AxiosConfig/Axios";
import { handleError } from "../../Utils/Error";

export const HandleLogin = async (data) => {
  try {
    const response = await Axios.post("/auth/login", {
      nim: data.nim,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const HandleRegister = async (data) => {
  try {
    const response = await Axios.post("/auth/register", {
      nim: data.nim,
      name : data.name,
      password: data.password,
      role: data.role,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const CheckSession = async (token) => {
  try {
    const response = await Axios.post("/auth/session", {
      token: token,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const Logout = async (id) => {
  try {
    const response = await Axios.post("/auth/logout/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const ForgotPassword = async (data) => {
  try {
    const response = await Axios.post("/auth/update/password/" + data.id, {
      password: data.password,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getDataUser = async (role) => {
  try {
    const response = await Axios.get("/auth/user/" + role);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
