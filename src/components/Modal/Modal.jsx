import React, { useEffect } from "react";
import { motion } from "framer-motion"; // Import motion
import { FaBullhorn, FaMusic } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, title, children , height }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <motion.div
        className={` bg-gray-100 ${height || "h-auto"} lg:${height || "h-auto"} lg:overflow-auto overflow-auto   rounded-lg shadow-lg w-11/12 max-w-lg`}
        initial={{ y: 10, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 10, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center border-b p-4">
          <div className="flex gap-3 items-center ">
            <FaBullhorn className="text-xl dark:text-white text-oren" />
            <h2 className="text-lg font-semibold text-black dark:text-white">{title}</h2>
          </div>
          <button
            className="text-black hover:text-orange-400"
            onClick={onClose}
          >
          <FaTimes />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
