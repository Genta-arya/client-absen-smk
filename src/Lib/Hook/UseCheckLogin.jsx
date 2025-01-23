import React, { useEffect, useState } from "react";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import { CheckSession } from "../../Api/Services/LoginServices";
import useAuthStore from "../Zustand/AuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UseCheckLogin = () => {
  const token = localStorage.getItem("token");
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetch = async () => {
    setLoading(true);

    try {
      const response = await CheckSession(token);
      setUser(response.data);
    } catch (error) {
      console.log(error);
      if (error.code === "ERR_BAD_REQUEST") {
        toast.error("Terjadi kesalahan pada server.");
        localStorage.removeItem("token");
      }
      ResponseHandler(error.response, "/");

      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return {
    user,
    loading,
  };
};

export default UseCheckLogin;
