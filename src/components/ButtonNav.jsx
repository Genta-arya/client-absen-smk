import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaClipboardList, FaCog } from "react-icons/fa";

const ButtonNav = () => {
  const navItems = [
    { name: "Home", path: "/app", icon: FaHome },
    { name: "Permohonan", path: "/permohonan", icon: FaClipboardList },
    { name: "Settings", path: "/settings", icon: FaCog },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue dark:bg-gray-800 shadow-lg border-t">
      <ul className="flex justify-around items-center py-4">
        {navItems.map((item) => (
          <li key={item.path} className="flex-1 text-center">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-all ${
                  isActive
                    ? "border-black text-white dark:border-gray-500  rounded-sm font-bold "
                    : "text-gray-300 dark:text-gray-300"
                }`
              }
            >
              <item.icon size={20} className="dark:text-white text-white" />
              <span className="text-xs ">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ButtonNav;
