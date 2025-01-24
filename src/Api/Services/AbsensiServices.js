import { handleError } from "../../Utils/Error";
import { Axios } from "../AxiosConfig/Axios";

export const HandleHadir = async (data) => {
  try {
    const response = await Axios.post("/absensi/hadir/" + data.id, {
      jam_masuk: data.jam_masuk,
      gps: data.gps,
      posisi: data.posisi,
      foto: data.foto,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const handlePulangs = async (data) => {
  try {
    const response = await Axios.post("/absensi/pulang/" + data.id, {
      jam_pulang: data.jam_pulang,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSingleAbsen = async (id) => {
  try {
    const response = await Axios.get("/absensi/detail/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
