import React from "react";
import { FaCalendarAlt, FaClipboardList, FaRegClipboard, FaUserAlt } from "react-icons/fa"; // Ikon Absensi dan Laporan Kegiatan
import { Link } from "react-router-dom";

const AppMenu = () => {
  const menuItems = [
    {
      title: "Absensi",
      icon: <FaClipboardList className="text-blue  text-3xl dark:text-white mb-4" />,
      link: "/app/daftar/absensi",
    },
    {
      title: "Laporan",
      icon: <FaRegClipboard className="text-blue text-3xl dark:text-white mb-4" />,
      link: "#",
    },
    {
      title: "Kalender",
      icon: <FaCalendarAlt  className="text-blue  text-3xl dark:text-white mb-4" />,
      link: "#",
    },
    {
      title: "Profil",
      icon: <FaUserAlt  className="text-blue text-3xl dark:text-white mb-4" />,
      link: "/app/profil",
    },
  ];

  return (
    <div className="">
      <div className="grid grid-cols-4 gap-2 px-0">
        {menuItems.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg  transition-all ease-in duration-300 border-b-4 border-b-oren hover:opacity-80 cursor-pointer"
          >
            {item.icon}
            <p className="text-center text-xs font-semibold text-blue">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AppMenu;
