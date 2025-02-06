import { handleError } from "../../Utils/Error";
import { Axios } from "../AxiosConfig/Axios";

export const getLaporanUser = async (id) => {
  try {
    const response = await Axios.get("/report/laporan/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSingleLaporan= async (id) => {
  try {
    const response = await Axios.get("/report/data/laporan/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};



export const getLaporanUserMingguan = async (id) => {
  try {
    const response = await Axios.get("/report/laporan/mingguan/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSingleLaporanMingguan= async (id) => {
  try {
    const response = await Axios.get("/report/data/laporan/mingguan/" + id);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};