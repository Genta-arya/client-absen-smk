import React from "react";
import Container from "../../components/Container";
import Tools from "../../components/Tools";
import MenuSetting from "./components/MenuSetting";
import useAuthStore from "../../Lib/Zustand/AuthStore";
import ContainerGlobal from "../../components/ContainerGlobal";
import HeaderBack from "../../components/HeaderBack";
import Navbar from "../../components/Navbar";

const MainSetting = () => {
  const { user } = useAuthStore();
  return (
    <div>
      {user?.role !== "user" ? (
        <Container>
          <Tools title={"Setting"} />
          <MenuSetting />
        </Container>
      ) : (
        <>
       
          <ContainerGlobal title={"Setting"}>
            <MenuSetting />
          </ContainerGlobal>
        </>
      )}
    </div>
  );
};

export default MainSetting;
