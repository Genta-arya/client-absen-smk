import React, { useEffect, useState } from "react";
import Siswa from "./Siswa";
import Pembimbing from "./Pembimbing";
import TabStore from "../../../Lib/Zustand/TabStore";
import Action from "./Action";
import useUser from "../../../Lib/Hook/useUser";

const Tab = () => {
  const { tab, setTab } = TabStore();
  const { data: dataSiswa, loading, updatePasswords, fetchData } = useUser();
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    fetchData();
  }, [tab]);

  const SearchFilter = (dataSiswa, searchTerm) => {
    return dataSiswa.filter((siswa) => {
      return (
        siswa?.nim
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        siswa?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

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
        {tab === "siswa" ? (
          <>
            <Action
              refresh={fetchData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder={"Cari Siswa"}
            />
            <Siswa
              dataSiswa={dataSiswa}
              loading={loading}
              fetchData={fetchData}
              updatePasswords={updatePasswords}
              SearchFilter={SearchFilter}
              searchTerm={searchTerm}
            />
          </>
        ) : (
          <>
            <Action
              refresh={fetchData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder={"Cari Pembimbing"}
            />
            <Pembimbing
              dataSiswa={dataSiswa}
              loading={loading}
              fetchData={fetchData}
              updatePasswords={updatePasswords}
              SearchFilter={SearchFilter}
              searchTerm={searchTerm}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Tab;
