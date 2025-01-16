import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import { Logout } from "../../Api/Services/LoginServices";
import useAuthStore from "../Zustand/AuthStore";

const UseLogout = () => {
  const [loading, setLoading] = useState(false);
  const { user, clearUser } = useAuthStore();
  const logout = async () => {
    setLoading(true);
    try {
      await Logout(user.id);
      localStorage.removeItem("token");
      clearUser();
      window.location.href = "/login";
    } catch (error) {
      ResponseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    user,
    logout,
  };
};

export default UseLogout;
