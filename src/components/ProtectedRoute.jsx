import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

import UseCheckLogin from "../Lib/Hook/UseCheckLogin";
import Loading from "./Loading";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { user, loading } = UseCheckLogin();
  const isAuthenticated = user?.status_login;

  const path = useLocation().pathname;

  if (loading) return <Loading />;
  if (path.includes("/app")) {
    if (!isAuthenticated || user?.role !== "user") {
      return <Navigate to={"/"} replace />;
    }
  }

  if (loading) {
    if (!isAuthenticated) {
      return <Navigate to={redirectPath} replace />;
    }
  }
  return <Outlet />;
};

export default ProtectedRoute;
