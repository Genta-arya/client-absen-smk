import React, { useEffect, useRef } from "react";
import { FaSignOutAlt, FaTimes } from "react-icons/fa";
import { Text } from "../constants/Constants";
import SideBarMenu from "./SideBarMenu";
import UseLogout from "../Lib/Hook/UseLogout";
import LoadingButton from "./LoadingButton";
import { BeatLoader, ScaleLoader } from "react-spinners";
import { div } from "framer-motion/m";

const Sidebar = ({ isMenuOpen, toggleMenu, setMenu, role }) => {
  const sidebarRef = useRef(null);
  const { logout, loading } = UseLogout();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMenu(false);
      }
    };
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleMenu]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 z-20 overflow-auto  w-64 h-full border-r  bg-blue text-white dark:bg-gray-800 dark:text-white p-1 transition-transform duration-300 transform ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex justify-between items-center">
          <button onClick={() => setMenu(false)} className="mt-4 ml-3">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex justify-start mt-5 px-1 gap-2">
          <img
            src="https://storage.apiservices.my.id/uploads/Screenshot_2025-01-16_075511-removebg-preview-1736988960901.png"
            alt="Logo"
            className="w-10 h-10 bg-white p-1 rounded-full"
          />
          <div className="flex flex-col">
            <p className="font-bold">SMK 2 KETAPANG</p>
            <p className="text-xs">V.1.0</p>
          </div>
        </div>

        <SideBarMenu role={role} />
        <div className="mt-auto border-t-2 mb-3">
          <button
            onClick={() => logout()}
            disabled={loading}
            className="flex items-center gap-4 py-2 hover:bg-oren dark:hover:bg-gray-700 hover:transition-all hover:duration-300 rounded-md px-4 w-full mt-4"
          >
            <FaSignOutAlt size={20} />
            <div className={Text}> {loading ? "Tunggu..." : "Logout"}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
