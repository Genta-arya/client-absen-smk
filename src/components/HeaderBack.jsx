import React, { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { Text } from "../constants/Constants";

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
        .toLocaleString("en-GB", {
          weekday: "long",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
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
    <div className="bg-white text-black dark:bg-dark-bg dark:text-white min-h-screen">
      <div className="border-b py-4 px-6 w-full flex justify-between items-center">
        <button className="flex items-center gap-3" onClick={handleBack}>
          <FaChevronLeft />
          <p>Back</p>
        </button>

        <div className={Text}>{dateTime}</div>
      </div>

      <div className="flex justify-center">
        <div className="w-full lg:max-w-7xl md:max-w-3xl mt-8 pb-8">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HeaderBack;
