import React from "react";
import { FaClipboardList, FaRegClipboard } from "react-icons/fa"; // Ikon Absensi dan Laporan Kegiatan

const AppMenu = () => {
  return (
    <>
      <div className="">
        <div className="mb-4">
          <h1 className="text-base font-bold">Menu</h1>
          <p className="text-xs dark:text-gray-300 text-gray-500">Silahkan pilih menu yang digunakan</p>
        </div>
        <div className="flex flex-col items-center justify-center   ">
          {/* Wrapper for both menu items */}
          <div className="flex flex-row gap-4 w-full">
            {/* Menu 1: Absensi */}
            <div className="flex hover:opacity-80  cursor-pointer flex-col items-center w-[100%] justify-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-b-oren border-b-4">
              <FaClipboardList
                size={40}
                className="text-blue dark:text-white mb-4"
              />
              <p className="text-center text-sm font-semibold text-gray-800 dark:text-white">
                Absensi
              </p>
            </div>

            {/* Menu 2: Laporan Kegiatan */}
            <div className="flex flex-col border-b-oren border-b-4 hover:opacity-80 cursor-pointer  w-[100%] items-center justify-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
              <FaRegClipboard
                size={40}
                className="text-blue dark:text-white mb-4"
              />
              <p className="text-center text-sm font-semibold text-gray-800 dark:text-white">
                Laporan
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppMenu;
