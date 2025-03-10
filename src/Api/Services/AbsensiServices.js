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
      gps_pulang: data.gps_pulang,
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

export const rekababsensi = async (id) => {
  try {
    const response = await Axios.get("/absensi/rekap/absen/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateStatus = async (id, status , keterangan) => {
  try {
    const response = await Axios.put("/absensi/update/status/" + id, {
      status: status,
      keterangan: keterangan,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
