import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";

import UseCheckLogin from "../Lib/Hook/UseCheckLogin";
import Loading from "./Loading";
import { toast } from "sonner";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { user, loading} = UseCheckLogin();
  const isAuthenticated = user?.status_login;
  const location = useLocation().pathname;
  const navigate = useNavigate();
  if (loading) {
    return <Loading />;
  }

  if (location.includes("/admin") && user?.role === "user") {
    navigate("/app");
    return null;
  }

  if (location.includes("/app") && user?.role !== "user") {
    navigate("/admin");
    return null;
  }

  if (isAuthenticated) {
    return <Outlet />;
  }
};

export default ProtectedRoute;
