import { toast } from "sonner";

export const ResponseHandler = (response, navigate = null) => {
  switch (response.status) {
    case 400:
      toast.error(response.data.message);
      throw response.data;

    case 409:
      localStorage.removeItem("token");
      toast.error(response.data.message, {
        duration: 2000,
        onAutoClose: () => (window.location.href = "/"),
      });
      throw response.data;
    case 403:
      localStorage.removeItem("token");
      toast.error(response.data.message, {
        duration: 2000,
        onAutoClose: () => (window.location.href = "/"),
      });
      throw response.data;

    case 401:
      toast.warning(response.data.message);
      throw response.data;

    case 404:
      toast.error(response.data.message);
      throw response.data;

    case 500:
      toast.error("Internal Server Error: Terjadi kesalahan pada server.", {
        onAutoClose: () => (window.location.href = "/"),
      });
      throw response.data;

    default:
      null;
  }
};
