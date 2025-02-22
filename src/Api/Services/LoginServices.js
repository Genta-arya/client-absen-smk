import { Axios, Axios2, AxiosFormData } from "../AxiosConfig/Axios";
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

export const CheckSession = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await Axios.post("/auth/session" , { token });
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
    const response = await Axios.post("/auth/update/user/password/" + data.id, {
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
      kelas: data.kelas,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateDataUsers = async (data) => {
  try {
    const response = await Axios.post(`/auth/update/users/${data.id}`, {
      name: data.name,
      nim: data.nim,
      email: data.email,
      kelas: data.kelas,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getKelas = async () => {
  try {
    const response = await Axios.get("/auth/kelas");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const CreateKelas = async (data) => {
  try {
    const response = await Axios.post("/auth/create/kelas", {
      nama: data.nama,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const EditKelas = async (data) => {
  try {
    const response = await Axios.put("/auth/kelas/" + data.id, {
      nama: data.nama,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const DeleteKelas = async (id) => {
  try {
    const response = await Axios.delete("/auth/kelas/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateSingleUser = async (data) => {
  try {
    const response = await Axios.put(`/auth/update/single/user/${data.id}`, {
      noHp: data.noHp,
      email: data.email,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    handleError(error);
  }
};
