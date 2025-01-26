import React from "react";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaRegClipboard,
  FaUserAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";

const AppMenu = () => {
  const { user } = useAuthStore();
  const data = user?.Pkl?.[0] || {}; // Berikan nilai default berupa objek kosong
 

  const menuItems = [
    {
      title: "PKL",
      icon: (
        <FaClipboardList className="text-blue text-3xl dark:text-white " />
      ),
      link: "/app/daftar/absensi",
    },
    {
      title: "Laporan",
      icon: (
        <FaRegClipboard className="text-blue text-3xl dark:text-white " />
      ),
      link: "#",
    },
    {
      title: "Kalender",
      icon: (
        <FaCalendarAlt className="text-blue text-3xl dark:text-white " />
      ),
      link: "/app/kalender",
    },
    {
      title: "Pembimbing",
      icon: <FaUserAlt className="text-blue text-3xl dark:text-white " />,
      link: `/app/detail/profile/${data.creatorId || "defaultId"}/${
        data.creator?.[0]?.name || "defaultName"
      }`,
    },
  ];

  return (
    <div className="">
      <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-2 gap-4 px-0">
        {menuItems.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all ease-in duration-300 border-b-2  hover:opacity-80 cursor-pointer"
          >
            <div className="flex md:flex-row lg:flex-row flex-col items-center  gap-2">
              {item.icon}
              <p className="text-center text-xs font-semibold text-blue">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AppMenu;
