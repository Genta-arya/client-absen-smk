import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Text } from "../constants/Constants";
import { FaArrowLeft } from "react-icons/fa";
import useAuthStore from "../Lib/Zustand/AuthStore";
import ScrollTop from "./ScrollTop";

const HeaderBack = ({ title }) => {
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState("");
  const { user } = useAuthStore();
  const [visible, setVisible] = useState(false);
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll dengan efek transisi
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 z-10 border-t-4  border-oren w-full bg-blue text-white  dark:bg-dark-bg ">
      <div className="border-b py-5  px-6 w-full flex justify-between items-center">
        <button className="flex items-center gap-3" onClick={handleBack}>
          <FaArrowLeft />
          <p className="font-bold text-lg">{title}</p>
        </button>
      </div>
      {visible && <ScrollTop scrollToTop={scrollToTop} />}
    </div>
  );
};

export default HeaderBack;
