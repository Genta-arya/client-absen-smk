import React from "react";
import Tools from "../../components/Tools";
import useAuthStore from "../../Lib/Zustand/AuthStore";
import Container from "../../components/Container";
import Tab from "./components/Tab";


const MainUser = () => {
  const { user } = useAuthStore();

  if ( user?.role !== "admin") {
    window.location.href = "/";
  }
  return (
   <Container role={user?.role}>
    <Tools title={"Management User"} />
    <Tab />
   </Container>
  );
};

export default MainUser;
