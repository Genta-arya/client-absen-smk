import React, { useEffect, useState } from "react";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import { CheckSession } from "../../Api/Services/LoginServices";
import useAuthStore from "../Zustand/AuthStore";
import { useNavigate } from "react-router-dom";

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
