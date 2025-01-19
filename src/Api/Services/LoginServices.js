import { Axios, AxiosFormData } from "../AxiosConfig/Axios";
import { handleError } from "../../Utils/Error";
import { UPLOAD_URL } from "../../constants/Constants";
import axios from "axios";

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
      name: data.name,
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

export const updatePassowrd = async (data) => {
  try {
    const response = await axios.post("/auth/update/user/password/" + data.id, {
      password: data.password,
      new_password: data.new_password,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// export const updateFotoProfile = async (data) => {
//   try {
//     const response = await AxiosFormData.post(
//       `/auth/update/profile/${data.id}`,
//       data.photo
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error uploading photo:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

export const updateFotoProfile = async (data) => {
  try {
    const response = await Axios.post(`/auth/update/profile/${data.id}`, {
      image_url: data.image_url,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error uploading photo:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getSingleUser = async (id) => {
  try {
    const response = await Axios.get(`/auth/detail/user/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const uploadProfile = async (data) => {
  try {
    const response = await axios.post(UPLOAD_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        genta: "Genta@456",
      },
    });
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const updateDataUser = async (data) => {
  try {
    const response = await Axios.post(`/auth/update/user/${data.id}`, {
      name: data.name,
      nim: data.nim,
      email: data.email,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
