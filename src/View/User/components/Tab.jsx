import React, { useState } from "react";
import Siswa from "./Siswa";
import Pembimbing from "./Pembimbing";
import TabStore from "../../../Lib/Zustand/TabStore";

const Tab = () => {
  const {tab , setTab} = TabStore();

  const handleTabClick = (tab) => {
    setTab(tab);
  };

  return (
    <div className="font-sans">
      <div className="flex border-b-2 border-gray-200">
        <button
          onClick={() => handleTabClick("siswa")}
          className={`flex-1 py-2 text-lg font-medium ${
            tab === "siswa"
              ? "border-b-4 border-oren text-blue"
              : "text-gray-500"
          }`}
        >
          Siswa
        </button>
        <button
          onClick={() => handleTabClick("pembimbing")}
          className={`flex-1 py-2 text-lg font-medium ${
            tab === "pembimbing"
              ? "border-b-4 border-oren text-blue"
              : "text-gray-500"
          }`}
        >
          Pembimbing
        </button>
      </div>
      <div className="p-4 ">
        {tab === "siswa" ? <Siswa /> : <Pembimbing />}
      </div>
    </div>
  );
};

export default Tab;
