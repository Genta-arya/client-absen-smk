import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import ScrollTop from "./ScrollTop";

const ContainerLayout = ({ children }) => {
  const [showButton, setShowButton] = useState(false);

  // Fungsi untuk menangani scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true); 
      } else {
        setShowButton(false); 
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fungsi untuk scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex justify-center relative">
      <div className="w-full  p-4">{children}</div>

      {showButton && (
        <ScrollTop  scrollToTop={scrollToTop} />
      
      )}
    </div>
  );
};

export default ContainerLayout;
