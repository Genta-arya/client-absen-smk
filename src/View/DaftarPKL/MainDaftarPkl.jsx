
import React from "react";
import Tools from "../../components/Tools";
import Container from "../../components/Container";
import ListPKL from "./components/ListPKL";


const MainDaftarPkl = () => {
  return (
    <Container>
      <Tools title={"Daftar PKL"} />
      <ListPKL />
    </Container>
  );
};

export default MainDaftarPkl;
