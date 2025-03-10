import { useState } from "react";

export default function AbsensiTab({ absensi, user }) {
  const [activeTab, setActiveTab] = useState("hadir");

  // Hitung jumlah berdasarkan status absensi
  const totalHadir = absensi.filter(
    (absen) => absen.hadir === "selesai"
  ).length;
  const totalTidakHadir = absensi.filter(
    (absen) => absen.hadir === "tidak_hadir"
  ).length;
  const totalIzin = absensi.filter(
    (absen) => absen.hadir === "izin" || absen.hadir === "sakit"
  ).length;

  return (
    <div className="mb-12">
      {/* Tabs */}
      <div className="flex w-full text-xs justify-center pb-2 mt-4">
        <button
          className={`py-2 w-full px-4 text-center ${
            activeTab === "hadir"
              ? "border-b-2 border-blue font-bold text-blue"
              : "text-gray-500 border-gray-300 border-b-2"
          }`}
          onClick={() => setActiveTab("hadir")}
        >
          Hadir
        </button>
        <button
          className={`py-2 w-full px-4 text-center ${
            activeTab === "tidak_hadir"
              ? "border-b-2 border-blue font-bold text-blue"
              : "text-gray-500 border-gray-300 border-b-2"
          }`}
          onClick={() => setActiveTab("tidak_hadir")}
        >
          Tidak Hadir
        </button>
        <button
          className={`py-2 w-full px-4 text-center ${
            activeTab === "izin"
              ? "border-b-2 border-blue font-bold text-blue"
              : "text-gray-500 border-gray-300 border-b-2"
          }`}
          onClick={() => setActiveTab("izin")}
        >
          Izin
        </button>
      </div>

      {/* Content */}
      <div className="mt-6 text-center">
        {activeTab === "hadir" && (
          <p className="text-xl font-bold text-green-600">{totalHadir} Hari</p>
        )}
        {activeTab === "tidak_hadir" && (
          <p className="text-xl font-bold text-red-600">
            {totalTidakHadir} Hari
          </p>
        )}
        {activeTab === "izin" && (
          <p className="text-xl font-bold text-yellow-600">{totalIzin} Hari</p>
        )}
      </div>
    </div>
  );
}
