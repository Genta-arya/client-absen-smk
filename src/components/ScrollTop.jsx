import React from "react";
import { FaArrowUp } from "react-icons/fa6";

const ScrollTop = ({ scrollToTop, enable }) => {
  return (
    <>
      {enable && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 z-20 right-5 bg-blue border-white border-2 text-white p-2 rounded-full shadow-lg hover:bg-orange-400 transition-all duration-300"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default ScrollTop;
