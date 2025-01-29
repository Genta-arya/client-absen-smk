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

export const addSiswaToPkl = async (data) => {
  try {
    const response = await Axios.put("/pkl/add/siswa", {
      pkl_id:data.pkl_id,
      shift_data: data.shift_data, // Mengirimkan data shift yang lebih dinamis
    });
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
      grupUrl: data.grupUrl,
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

export const updateStatusPkl = async (data) => {
  try {
    const response = await Axios.put("/pkl/status/" + data.id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};


export const removeSingleUser = async (data) => {
  try {
    const response = await Axios.put("/pkl/remove/siswa/" + data.id, {
      isDelete : data.isDelete,
      siswaId : data.siswaId
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAnggotaPkl = async (id) => {
  try {
    const response = await Axios.get("/pkl/anggota/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};