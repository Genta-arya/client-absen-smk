import React, { useEffect } from "react";
import { motion } from "framer-motion"; // Import motion
import { FaBullhorn, FaMusic } from "react-icons/fa6";

const Modal = ({ isOpen, onClose, title, children }) => {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <motion.div
        className="dark:bg-dark-bg bg-gray-100 rounded-lg shadow-lg w-11/12 max-w-lg"
        initial={{ y: 10, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 10, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center border-b p-4">
          <div className="flex gap-3 items-center">
            <FaBullhorn className="text-xl dark:text-white" />
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <button
            className="text-gray-500 hover:text-orange-400"
            onClick={onClose}
          >
            ✖
          </button>
        </div>
        <div className="p-4">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
