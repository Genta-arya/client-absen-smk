import { Axios } from "../AxiosConfig/Axios";

export const createPKL = async (data) => {
    try {
        const response = await Axios.post("/pkl/create", data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}