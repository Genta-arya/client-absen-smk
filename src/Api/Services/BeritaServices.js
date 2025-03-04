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


export const getBerita = async () => {
  try {
    const response = await Axios.get("/berita/list");
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
    const response = await Axios.patch("/berita/status/" + data.id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};