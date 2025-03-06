import React from "react";
import Button from "../../Button";
import { FaPlus } from "react-icons/fa";
import Container from "../../Container";
import Tools from "../../Tools";
import { useNavigate } from "react-router-dom";
import ListPKL from "./components/ListPKL";
import Search from "../../Search";
import { useState } from "react";

const MainPKL = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
   
      <div className=" px-4 ">
        <div className="flex justify-between items-center gap-2">
          <Button
            icon={<FaPlus />}
            style="bg-blue"
            title="Tempat PKL"
            onClick={() => navigate("/admin/management/pkl/create")}
          />

          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={"Cari..."}
          />
        </div>
        <ListPKL searchTerm={searchTerm} />
      </div>
    </>
  );
};

export default MainPKL;
