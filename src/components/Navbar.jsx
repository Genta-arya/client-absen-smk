import React, { useEffect, useState } from "react";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { toast } from "sonner";

const Navbar = ({ role }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(true);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode) {
      setIsDarkMode(savedMode === "dark");
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    toast.info("Change Theme , Please wait...", {
      duration: 2000,
      onAutoClose: () => setIsDarkMode(!isDarkMode),
    });
  };

  return (
    <div className="bg-blue border-oren dark:border-white text-white p-2 border-b-2 shadow-md dark:bg-dark-bg   dark:text-white px-4 lg:px-8 ">
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-10 ${
          isMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {role !== "user" && (
        <Sidebar
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          setMenu={setIsMenuOpen}
        />
      )}

      <nav className="">
        <div className="flex items-center justify-between">
          {role !== "user" ? (
            <div className="flex  gap-4 flex-row-reverse justify-between w-full">
              <button onClick={toggleMenu} className="" title="Menu">
                {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              <div className="flex items-center gap-4">
                <img
                  src="https://storage.apiservices.my.id/uploads/Screenshot_2025-01-16_075511-removebg-preview-1736988960901.png"
                  alt="Logo"
                  className="w-10 h-10 bg-white p-1 rounded-full"
                />

                <div className="flex items-start gap-1 flex-col">
                  <p className="text-xl font-extrabold uppercase text-oren">
                    Lampias
                  </p>
                  <div>
                    <p className="text-xs font-bold">
                      Management Praktek Kerja Lapangan
                    </p>
                    <p className="text-xs">Versi 1.0</p>
                  </div>
                </div>
              </div>


              
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScfqgzc3z4pYYehdJbSmuMT8Gp7abIEiE-zw&s"
                  alt="Logo"
                  className="w-10 h-10 rounded-full"
                />

                <div className="flex items-start gap-1 flex-col">
                  <p className="text-xl font-extrabold uppercase text-oren">
                    Lampias
                  </p>
                  <div>
                    <p className="text-xs font-bold">
                      Management Praktek Kerja Lapangan
                    </p>
                    <p className="text-xs">Versi 1.0</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              title="Theme"
              className=" p-2 rounded-full border-gray-300 dark:border-gray-600"
            >
              {isDarkMode ? (
                <FaSun color="yellow" size={20} />
              ) : (
                <FaMoon color="yellow" />
              )}
            </button>
          </div> */}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
