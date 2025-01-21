import { handleError } from "../../Utils/Error";
import { Axios } from "../AxiosConfig/Axios";

export const HandleHadir = async (data) => {
  try {
    const response = await Axios.post("/absensi/hadir/" + data.id, {
      jam_masuk: data.jam_masuk,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
