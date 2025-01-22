import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Text } from "../constants/Constants";
import { FaArrowLeft } from "react-icons/fa";
import useAuthStore from "../Lib/Zustand/AuthStore";

const HeaderBack = ({ children }) => {
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState("");
  const { user } = useAuthStore();
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const serverDate = new Date(user?.tanggal);

      // Konversi ke UTC+7
      const utc7Date = new Date(serverDate.getTime() + 7 * 60 * 60 * 1000);
      // Format waktu dalam bahasa Indonesia
      const formattedTime = utc7Date
        .toLocaleString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long", // Gunakan "long" untuk bulan dalam format lengkap
          year: "numeric",

          hour12: false,
          timeZone: "Asia/Jakarta", // Zona waktu Indonesia
        })
        .replace(",", " ,");

      setDateTime(formattedTime);
    };

    const interval = setInterval(updateTime, 1000); // Perbarui setiap detik
    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, []);

  return (
    <div className="bg-white text-black dark:bg-dark-bg dark:text-white ">
      <div className="border-b py-5  px-6 w-full flex justify-between items-center">
        <button className="flex items-center gap-3" onClick={handleBack}>
          <FaArrowLeft />
        </button>

        <div className={Text}>{dateTime}</div>
      </div>
    </div>
  );
};

export default HeaderBack;
