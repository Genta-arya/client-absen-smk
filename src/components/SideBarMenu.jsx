import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaCog,
  FaFolderOpen,
  FaCircle,
  FaWarehouse,
  FaSchool,
  FaEnvelope,
} from "react-icons/fa";
import { FaCircleRight } from "react-icons/fa6";
import useAuthStore from "../Lib/Zustand/AuthStore";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: FaHome },
  // {
  //   name: "Daftar Permohonan",
  //   path: "#",
  //   icon: FaClipboardList,
  //   submenu: [{ name: "Permohonan PKL", path: "/admin/permohonan/list" }],
  // },

  {
    name: "Daftar PKL",
    path: "/admin/daftar/pkl",
    icon: FaEnvelope,
    // Hanya tampilkan jika role admin
    restrictedTo: 'admin',
  },
  {
    name: "Management User",
    path: "/admin/user",
    icon: FaUser,
    // Hanya tampilkan jika role admin
    restrictedTo: 'admin',
  },
  

  {
    name: "Management Kelas",
    path: "/admin/kelas",
    icon: FaSchool,
    // Hanya tampilkan jika role admin
    restrictedTo: 'admin',
  },
  { name: "Settings", path: "/admin/setting", icon: FaCog },
];

const SideBarMenu = ({ role }) => {
  const [activeMenu, setActiveMenu] = useState(null);
const {user} = useAuthStore();
  const toggleSubMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const isActive = (path) =>
    window.location.pathname === path
      ? "dark:bg-gray-700 dark:text-white bg-oren px-4 rounded-md"
      : "";

  // Filter menuItems berdasarkan role
  const filteredMenuItems = menuItems.filter(item => {
    if (item.restrictedTo === 'admin' && user?.role !== 'admin') {
      return false; // Sembunyikan "Management User" jika bukan admin
    }
    if (item.restrictedTo === 'non-admin' && user?.role === 'admin') {
      return false; // Sembunyikan "Management Absensi" jika admin
    }
    return true;
  });

  return (
    <ul className="mt-6">
      {filteredMenuItems.map((item) => (
        <li key={item.name} className="relative">
          {item.submenu ? (
            <div
              onClick={() => toggleSubMenu(item.name)}
              className="flex items-center py-2 cursor-pointer"
            >
              <div
                className={`flex w-full py-1 items-center gap-4 hover:dark:bg-gray-700 hover:dark:text-white hover:bg-oren rounded-md hover:transition-all hover:duration-300 px-4`}
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
              activeClassName="dark:bg-gray-700 dark:text-white bg-gray-300 rounded-md"
            >
              <div
                className={`flex w-full py-1 items-center gap-4 hover:dark:bg-gray-700 hover:dark:text-white hover:bg-oren rounded-md hover:transition-all hover:duration-300 px-4 ${isActive(
                  item.path
                )}`}
              >
                <item.icon size={20} />
                <div className="text-sm">{item.name}</div>
              </div>
            </NavLink>
          )}

          {item.submenu && activeMenu === item.name && (
            <ul className="ml-4 space-y-0">
              {item.submenu.map((submenuItem) => (
                <li key={submenuItem.path}>
                  <NavLink
                    to={submenuItem.path}
                    className="flex items-center py-2"
                    activeClassName="dark:bg-gray-700 dark:text-white bg-gray-300 rounded-md"
                  >
                    <div
                      className={`flex w-full py-1 items-center gap-4 hover:dark:bg-gray-700 hover:dark:text-white hover:bg-oren rounded-md hover:transition-all hover:duration-300 px-4 ${isActive(
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
