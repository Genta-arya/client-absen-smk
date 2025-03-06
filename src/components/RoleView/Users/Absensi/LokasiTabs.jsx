import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const LokasiTabs = ({ lokasiMasuk, lokasiPulang, data }) => {
  const [tab, setTab] = useState("masuk");

  const getMapUrl = (lokasi) =>
    `https://www.google.com/maps?q=${lokasi}&output=embed`;

  return (
    <div className="w-full  text-xs">
      <div className="flex justify-center border-b">
        <button
          className={`py-2 px-4 w-1/2 ${
            tab === "masuk"
              ? "border-b-2 border-blue text-blue"
              : "text-gray-500"
          }`}
          onClick={() => setTab("masuk")}
        >
          Lokasi Masuk
        </button>
        <button
          className={`py-2 px-4 w-1/2 ${
            tab === "pulang"
              ? "border-b-2 border-blue text-blue"
              : "text-gray-500"
          }`}
          onClick={() => setTab("pulang")}
        >
          Lokasi Pulang
        </button>
      </div>

      <div className="p-4">
        {tab === "masuk" && (
          <div className="text-center">
            <a
              href={`https://www.google.com/maps?q=${data.gps}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue hover:underline mt-4"
            >
              <div className="flex flex-col">
                {/* <span className="text-gray-900">{data.posisi}</span> */}
                <span className="text-gray-500">{data.gps}</span>
              </div>
            </a>

            {lokasiMasuk ? (
              <iframe
                src={getMapUrl(lokasiMasuk)}
                title="Lokasi Masuk"
                className="w-full h-96 mt-4 rounded-lg border"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="text-gray-600 flex justify-center items-center gap-2">
                <FaMapMarkerAlt /> Lokasi masuk tidak tersedia
              </p>
            )}
          </div>
        )}

        {tab === "pulang" && (
          <div className="text-center">
            <a
              href={`https://www.google.com/maps?q=${data.gps_pulang}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue hover:underline mt-4"
            >
              <div className="flex flex-col">
                {/* <span className="text-gray-900">{data.posisi}</span> */}
                <span className="text-gray-500">{data.gps_pulang}</span>
              </div>
            </a>
            {lokasiPulang ? (
              <iframe
                src={getMapUrl(lokasiPulang)}
                title="Lokasi Pulang"
                className="w-full h-96 mt-4 rounded-lg border"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="text-gray-600 flex text-base mt-4  justify-center items-center gap-2">
                <FaMapMarkerAlt /> Lokasi pulang tidak tersedia
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LokasiTabs;
