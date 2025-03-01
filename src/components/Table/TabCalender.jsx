import { useState } from "react";

export default function AbsensiTab({ absensi, user }) {
  const [activeTab, setActiveTab] = useState("hadir");

  const totalHadir = absensi.filter(
    (absen) => absen.hadir === "selesai"
  ).length;

  const TidakHadir = absensi.filter(
    (absen) => absen.hadir === "tidak_hadir"
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
            activeTab === "tidakHadir"
              ? "border-b-2 border-blue  font-bold text-blue"
              : "text-gray-500 border-gray-300 border-b-2"
          }`}
          onClick={() => setActiveTab("tidakHadir")}
        >
          Tidak Hadir
        </button>
      </div>

      {/* Content */}
      <div className="mt-6 text-center">
        {activeTab === "hadir" ? (
          <div>
            <p className="text-xl font-bold text-green-600">
              {totalHadir} Hari
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xl font-bold text-red-600">{TidakHadir} Hari</p>
          </div>
        )}
      </div>
    </div>
  );
}
