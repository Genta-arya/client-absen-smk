import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const HeaderBack = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };



  return (
    <div className="fixed top-0 z-10 border-t-4  border-oren w-full bg-blue text-white  dark:bg-dark-bg ">
      <div className="border-b py-4  px-6 w-full flex justify-between items-center">
        <button className="flex items-center gap-3" onClick={handleBack}>
          <FaArrowLeft />
          <p className="font-bold md:text-lg lg:text-lg text-sm">{title}</p>
        </button>
      </div>
    </div>
  );
};

export default HeaderBack;
