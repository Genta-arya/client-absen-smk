import { handleError } from "../../Utils/Error";
import { Axios } from "../AxiosConfig/Axios";

export const createPKL = async (data) => {
  try {
    const response = await Axios.post("/pkl/create", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPKLCreator = async (id) => {
  try {
    const response = await Axios.get("/pkl/creator/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSinglePkl = async (id) => {
  try {
    const response = await Axios.get("/pkl/detail/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updatePkl = async (data) => {
  try {
    const response = await Axios.put("/pkl/edit/" + data.id, {
      alamat: data.address,
      name: data.name,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const DeletePkl = async (id) => {
  try {
    const response = await Axios.put("/pkl/delete/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
