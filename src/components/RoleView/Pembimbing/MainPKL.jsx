import React from "react";
import ContainerGlobal from "../../ContainerGlobal";
import Button from "../../Button";
import { FaPlus } from "react-icons/fa";
import Container from "../../Container";
import Tools from "../../Tools";
import { useNavigate } from "react-router-dom";


const MainPKL = () => {
  const navigate =useNavigate();
  return (
    <Container>
     <Tools title={"Management PKL"} />
      <div className=" px-4">
        <div>
          <Button icon={<FaPlus />} style="bg-blue" title="Tempat PKL" onClick={() => navigate("/management/pkl/create")} />
        </div>
      </div>
    </Container>
  );
};

export default MainPKL;
