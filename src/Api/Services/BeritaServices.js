import { handleError } from "../../Utils/Error";
import { Axios } from "../AxiosConfig/Axios";

export const createBerita = async (data) => {
  try {
    const response = await Axios.post("/berita/create", {
      title: data.title,
      content: data.content,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};


export const getBerita = async (role) => {
  try {
    const response = await Axios.get("/berita/list/" + role);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const EditBerita = async (data) => {
  try {
    const response = await Axios.put("/berita/update/" + data.id, {
      title: data.title,
      content: data.content,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const EditStatusBerita = async (data) => {
  try {
    const response = await Axios.put("/berita/update/status/" + data.id , {
      status: data.status
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const hapusBerita = async (id) => {
  try {
    const response = await Axios.delete("/berita/delete/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};