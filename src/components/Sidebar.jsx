import React, { useEffect, useRef } from "react";
import { FaSignOutAlt, FaTimes } from "react-icons/fa";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { menuItems, Text } from "../constants/Constants";
import SideBarMenu from "./SideBarMenu";

const Sidebar = ({ isMenuOpen, toggleMenu, setMenu , role}) => {
  const sidebarRef = useRef(null);
  
  const navigate = useNavigate();
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
      className={`fixed top-0 left-0 z-20 overflow-auto  w-64 h-full border-r bg-white dark:bg-gray-800 dark:text-white p-1 transition-transform duration-300 transform ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex justify-between items-center">
          <button onClick={() => setMenu(false)} className="mt-4 ml-3">
            <FaTimes size={20} />
          </button>
        </div>
        <SideBarMenu role={role} />
        <div className="mt-auto border-t-2 mb-3">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 hover:transition-all hover:duration-300 rounded-md px-4 w-full mt-4"
          >
            <FaSignOutAlt size={20} />
            <div className={Text}>Sign Out</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
