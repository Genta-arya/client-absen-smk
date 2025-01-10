import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaCog,
  FaFolderOpen,
  FaCircle,
} from "react-icons/fa";
import { FaCircleRight } from "react-icons/fa6";

const menuItems = [
  { name: "Dashboard", path: "/", icon: FaHome },
  {
    name: "Daftar Permohonan",
    path: "#",
    icon: FaClipboardList,
    submenu: [{ name: "Permohonan PKL", path: "/permohonan/list" }],
  },
  {
    name: "Management User",
    path: "#",
    icon: FaUser,
    submenu: [
        { name: "Siswa", path: "/siswa/list" },
        { name: "Pembimbing", path: "/pembimbing/list" },
    ],
  },

  
  { name: "Settings", path: "/settings", icon: FaCog },
];

const SideBarMenu = ({role}) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleSubMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const isActive = (path) =>
    window.location.pathname === path
      ? "dark:bg-gray-700 dark:text-white bg-gray-300 px-4 rounded-md"
      : "";

  return (
    <ul className="mt-6">
      {menuItems.map((item) => (
        <li key={item.name} className="relative">
          {item.submenu ? (
            <div
              onClick={() => toggleSubMenu(item.name)}
              className="flex items-center py-2 cursor-pointer"
            >
              <div
                className={`flex w-full py-1 items-center gap-4 hover:dark:bg-gray-700 hover:dark:text-white hover:bg-gray-300 rounded-md hover:transition-all hover:duration-300 px-4`}
              >
                <item.icon size={20} />
                <div className="text-sm">{item.name}</div>
                <FaCircleRight
                  className={`ml-auto transition-transform ${
                    activeMenu === item.name ? "rotate-90" : "rotate-0"
                  }`}
                />
              </div>
            </div>
          ) : (
            <NavLink
              to={item.path}
              className="flex items-center py-2 transition-all duration-300 translate-x-0 ease-in-out"
              activeClassName="dark:bg-gray-700 dark:text-white bg-gray-300 rounded-md  "
            >
              <div
                className={`flex w-full py-1 items-center gap-4 hover:dark:bg-gray-700 hover:dark:text-white hover:bg-gray-300 rounded-md hover:transition-all hover:duration-300 px-4 ${isActive(
                  item.path
                )}`}
              >
                <item.icon size={20} />
                <div className="text-sm">{item.name}</div>
              </div>
            </NavLink>
          )}

          {item.submenu && activeMenu === item.name && (
            <ul className="ml-4  space-y-0">
              {item.submenu.map((submenuItem) => (
                <li key={submenuItem.path}>
                  <NavLink
                    to={submenuItem.path}
                    className="flex items-center py-2"
                    activeClassName="dark:bg-gray-700 dark:text-white bg-gray-300 rounded-md"
                  >
                    <div
                      className={`flex w-full py-1 items-center gap-4 hover:dark:bg-gray-700 hover:dark:text-white hover:bg-gray-300 rounded-md hover:transition-all hover:duration-300 px-4 ${isActive(
                        submenuItem.path
                      )}`}
                    >
                      <div className="flex items-center gap-2">
                        <FaCircle size={10} />

                        <div className="text-sm">{submenuItem.name}</div>
                      </div>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SideBarMenu;
