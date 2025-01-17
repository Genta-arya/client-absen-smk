import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Text } from "../constants/Constants";
import { FaArrowLeft } from "react-icons/fa";

const HeaderBack = ({ children }) => {
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState("");

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now
        .toLocaleString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "short",
          year: "numeric",
         
         
          hour12: false,
        })
        .replace(",", "-");

      setDateTime(formattedTime);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-white text-black dark:bg-dark-bg dark:text-white ">
      <div className="border-b py-2  px-6 w-full flex justify-between items-center">
        <button className="flex items-center gap-3" onClick={handleBack}>
          <FaArrowLeft />
       
        </button>

        <div className={Text}>{dateTime}</div>
      </div>
    </div>
  );
};

export default HeaderBack;
