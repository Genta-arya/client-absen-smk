import React, { useEffect } from "react";
import useAuthStore from "../../../Lib/Zustand/AuthStore";
import { FaLock, FaSignOutAlt, FaUserAlt, FaWhatsapp } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import UseLogout from "../../../Lib/Hook/UseLogout";
import Loading from "../../../components/Loading";
import { Link } from "react-router-dom";

const MenuSetting = () => {
  const { user } = useAuthStore();
  const { logout, loading } = UseLogout();

  const handleContactDeveloper = () => {
    const whatsappLink = "https://wa.me/6289618601348";
    window.open(whatsappLink, "_blank");
  };

  if (loading) return <Loading />;
  return (
    <div className=" bg-white  rounded-lg p-0 md:p-0 lg:p-4">
      <ul className="space-y-1">
        <Link to={user?.role !== "user" ? "/admin/profil" : "/app/profil"} className="">
          <div className="flex items-center border-b border-gray-300 hover:bg-gray-100 px-2">
            <FaUserAlt />

            <button className="w-full text-left px-4 py-2 text-gray-700 ">
              Profil
            </button>
          </div>
        </Link>
        <Link
          to={ user?.role !== "user" ? "/admin/ganti/password" : "/app/ganti/password"}
          className="border-b border-black"
          onClick={() => {}}
        >
          <div className="flex items-center border-b border-gray-300 hover:bg-gray-100 px-2">
            <FaLock />

            <button className="w-full text-left px-4 py-2 text-gray-700 ">
              Ganti Password
            </button>
          </div>
        </Link>

        {user?.role !== "user" && (
          <li className="" onClick={() => handleContactDeveloper()}>
            <div className="flex items-center border-b border-gray-300 hover:bg-gray-100 px-2">
              <FaWhatsapp />

              <button className="w-full text-left px-4 py-2 text-gray-700 ">
                Hubungi developer
              </button>
            </div>
          </li>
        )}

        <li className="" onClick={() => logout()}>
          <div className="flex items-center border-b border-gray-300 hover:bg-gray-100 px-2">
            <FaSignOutAlt />

            <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Logout
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MenuSetting;
