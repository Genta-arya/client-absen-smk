import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainHome from "../View/Homes/MainHome";
import MainUsers from "./RoleView/Users/MainUsers";
import Container from "./Container";
import useAuthStore from "../Lib/Zustand/AuthStore";

const LayoutRender = () => {
  const { user  } = useAuthStore();
  const role = user?.role;
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    switch (role) {
      case "admin":
        navigate("/");
        break;
      case "user":
        navigate("/app");
        break;
      case "pembimbing":
        navigate("/");
        break;
      default:
        navigate("/");
        break;
    }
  }, [role, navigate]);

  let content;
  switch (location.pathname) {
    case "/":
      content = <MainHome role={role} user={user}  />;
      break;
    case "/app":
      content =
        role === "user" ? (
          <MainUsers role={role} user={user}  />
        ) : null;
      break;
    case "/pembimbing/app":
      content =
        role === "pembimbing" ? (
          <MainHome role={role}  />
        ) : null;
      break;
    default:
      content = <MainHome />;
      break;
  }

  return <>{user !== null && <Container role={role}>{content}</Container>}</>;
};

export default LayoutRender;
