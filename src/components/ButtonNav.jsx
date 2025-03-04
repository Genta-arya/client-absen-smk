import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaClipboardList, FaCog } from "react-icons/fa";

const ButtonNav = () => {
  const navItems = [
    { name: "Home", path: "/app", icon: FaHome, disabled: false },
    { name: "Permohonan", path: "/#", icon: FaClipboardList, disabled: true },
    { name: "Settings", path: "/app/setting", icon: FaCog, disabled: false },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white shadow-lg text-xs">
      <ul className="flex justify-around items-center py-1 pt-2.5">
        {navItems.map((item) => (
          <li key={item.path} className="flex-1 text-center">
            {item.disabled ? (
              <div className="flex flex-col items-center gap-1 text-gray-400 cursor-not-allowed">
                <item.icon size={24} />
                <span className="text-xs">{item.name}</span>
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 transition-all ${
                    isActive
                      ? "border-black dark:border-gray-500 text-blue rounded-sm font-bold"
                      : "text-gray-700 dark:text-gray-800"
                  }`
                }
              >
                <item.icon size={24} className="text-blue" />
                <span className="text-xs">{item.name}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ButtonNav;
