import React from "react";
import ContainerLayout from "./ContainerLayout";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import UseLogout from "../Lib/Hook/UseLogout";
import { BeatLoader } from "react-spinners";

const Headers = ({ role, user }) => {
  const navigate = useNavigate();
  const { logout, loading } = UseLogout();

  return (
    <>
      <ContainerLayout>
        <div className="font-bold flex  flex-col z-10 justify-center px-4 gap-1 h-32 border border-gray-300 rounded-lg dark:bg-gray-600 bg-gray-100">
          {/* cdn dummy profile */}
          <div className="flex justify-between">
            <div className="flex gap-3 items-center">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg"
                alt="profile"
                onClick={() => navigate("/profile")}
                className="w-12 h-12 rounded-full hover:cursor-pointer"
              />
              <div>
                <p className="lg:text-lg md:text-lg text-base">Welcome</p>
                <p className="text-sm">Hi, {user?.name || "User"}</p>
                <p className="text-xs">
                  Email : {user?.email || "User@email.com"}
                </p>
                <p className="text-xs mt-2">Akses : {user?.role}</p>
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
