import React, { useEffect, useState } from "react";
import { ResponseHandler } from "../../../../../Utils/ResponseHandler";
import { getLaporanUserMingguan } from "../../../../../Api/Services/LaporanServices";
import useAuthStore from "../../../../../Lib/Zustand/AuthStore";
import Loading from "../../../../Loading";
import NotfoundData from "../../../../NotfoundData";
import {
  FaArrowRight,
  FaCalendar,
  FaCircle,
  FaClipboardList,
  FaPrint,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { div } from "framer-motion/m";

const DaftarLaporanMingguan = () => {
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataProgress, setDataProgress] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const { id } = useParams();
  const fetchDataLaporan = async () => {
    setLoading(true);
    let response;
    try {
      if (user?.id && user?.role === "user") {
        const id = user?.id;
        response = await getLaporanUserMingguan(id);
      } else {
        response = await getLaporanUserMingguan(id);
      }

      const sortedData = response.data.sort(
        (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
      );
      setData(sortedData);
      setDataProgress(sortedData);
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataLaporan();
  }, []);

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  let filteredData = dataProgress;

  filteredData = selectedStatus
    ? filteredData.filter((item) => item.status_selesai === selectedStatus)
    : filteredData;

  const totalLaporan = dataProgress.length;
  const selesaiCount = dataProgress.filter(
    (item) => item.status_selesai === "Selesai"
  ).length;
  const belumCount = totalLaporan - selesaiCount;

  const progress = totalLaporan > 0 ? (selesaiCount / totalLaporan) * 100 : 0;

  if (loading) return <Loading />;

  return (
    <div className="">
      {totalLaporan > 0 && (
        <>
          {user?.role === "user" && (
            <Link
              to={`/app/cetak/laporan/mingguan/rekap/${user?.id}`}
              className="flex justify-end items-center gap-2 cursor-pointer"
            >
              <FaPrint />
              <p>Rekap Jurnal</p>
            </Link>
          )}
          <div className="flex justify-between items-center gap-2 mb-6">
            <div className="text-xs md:w-full lg:w-full w-full">
              <label className="block mb-2">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full md:w-full p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
              >
                <option value="">Semua</option>
                <option value="Belum">Belum</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Progres Jurnal: {progress.toFixed(1)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 relative">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <p className="text-red-500">Belum: {belumCount}</p>
              <p className="text-green-500">Selesai: {selesaiCount}</p>
            </div>
          </div>
        </>
      )}

      {filteredData.length === 0 || loading ? (
        <NotfoundData />
      ) : (
        <div className="space-y-6">
          {filteredData.map((item, idx) => (
            <Link
              to={
                user?.role !== "user"
                  ? `/admin/laporan/mingguan/${idx + 1}/${item.id}`
                  : `/app/laporan/mingguan/${idx + 1}/${item.id}`
              }
              key={idx}
              className=" flex border-b hover:bg-gray-50 transition-all ease-in-out duration-300 py-2 px-3 justify-between"
            >
              <ul className="space-y-2 flex justify-between w-full">
                <div className="flex py-1 justify-between">
                  <li className="text-blue-600 text-lg font-medium ">
                    <div className="flex items-center gap-2 text-blue">
                      <FaCircle
                        size={10}
                        color={
                          item.status_selesai === "Selesai" ? "green" : "red"
                        }
                      />
                      <div>
                        <p className="text-sm font-bold">
                          Minggu ke - {idx + 1}
                        </p>
                      </div>
                    </div>
                  </li>
                </div>
                <FaArrowRight />
              </ul>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DaftarLaporanMingguan;
