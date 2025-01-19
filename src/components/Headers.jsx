import React from "react";
import ContainerLayout from "./ContainerLayout";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import UseLogout from "../Lib/Hook/UseLogout";
import { BeatLoader } from "react-spinners";

const Headers = ({ role, user }) => {
  const { logout, loading } = UseLogout();
  const navigate = useNavigate();
  return (
    <>
      <ContainerLayout>
        <div className="font-bold flex  flex-col z-10 justify-center px-4 gap-1 h-32 border border-gray-300 rounded-lg dark:bg-gray-600 bg-gray-100">
          {/* cdn dummy profile */}
          <div className="flex justify-between">
            <div className="flex gap-3 items-center">
              <img
                src={user?.avatar}
                alt="profile"
                onClick={() => navigate("/admin/profil")}
                className="w-12 h-12 rounded-full hover:cursor-pointer"
              />
              <div>
                <p className="lg:text-lg md:text-lg text-base">Welcome</p>
                <p className="text-sm">Hi, {user?.name || "-"}</p>
                <p className="text-xs">{user?.email || "Email: -"}</p>
                {user?.role !== "user" && (
                  <p className="text-xs mt-2">Akses : {user?.role || role}</p>
                )}
              </div>
            </div>

            <button
              disabled={loading}
              className="hover:opacity-80"
              onClick={() => logout()}
            >
              <div className="flex items-center gap-2">
                <FaSignOutAlt />
                {loading ? (
                  <BeatLoader size={10} color="#F97316" />
                ) : (
                  <p>Logout</p>
                )}
              </div>
            </button>
          </div>
        </div>
      </ContainerLayout>
    </>
  );
};

export default Headers;
