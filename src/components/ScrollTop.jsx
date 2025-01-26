import React from "react";
import { FaArrowUp } from "react-icons/fa6";

const ScrollTop = ({ scrollToTop }) => {
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 bg-blue border-white border-2 text-white p-3 rounded-full shadow-lg hover:bg-orange-400 transition-all duration-300"
    >
      <FaArrowUp />
    </button>
  );
};

export default ScrollTop;
