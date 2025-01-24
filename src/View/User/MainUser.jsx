import React, { useEffect } from "react";
import Tools from "../../components/Tools";
import useAuthStore from "../../Lib/Zustand/AuthStore";
import Container from "../../components/Container";
import Tab from "./components/Tab";

const MainUser = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role !== "admin") {
      window.location.href = "/";
      alert("Anda tidak memiliki akses ke halaman ini.");
    }
  }, [user]);

  return (
    <Container role={user?.role}>
      <Tools title={"Management User"} />
      <Tab />
    </Container>
  );
};

export default MainUser;
