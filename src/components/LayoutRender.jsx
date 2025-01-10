import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainHome from "../View/Homes/MainHome";
import MainUsers from "./RoleView/Users/MainUsers";
import Container from "./Container";

const LayoutRender = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect pengguna berdasarkan role yang berubah
  useEffect(() => {
    switch (role) {
      case "admin":
        navigate("/");
        break;
      case "user":
        navigate("/app");
        break;
      case "pembimbing":
        navigate("/pembimbing/app");
        break;
      default:
        navigate("/");
        break;
    }
  }, [role, navigate]);

  // Render konten berdasarkan path dan role
  let content;
  switch (location.pathname) {
    case "/":
      content = <MainHome />;
      break;
    case "/app":
      content = role === "user" ? <MainUsers role={role} /> : null;
      break;
    case "/pembimbing/app":
      content = role === "pembimbing" ? <MainHome /> : null;
      break;
    default:
      content = <MainHome />;
      break;
  }

  return <Container role={role}>{content}</Container>;
};

export default LayoutRender;
