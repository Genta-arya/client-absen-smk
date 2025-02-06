import React, { useEffect, useState } from "react";
import { ResponseHandler } from "../../../../../Utils/ResponseHandler";
import { getLaporanUser } from "../../../../../Api/Services/LaporanServices";
import useAuthStore from "../../../../../Lib/Zustand/AuthStore";
import Loading from "../../../../Loading";
import NotfoundData from "../../../../NotfoundData";
import { FaCalendar, FaCircle, FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";
const DaftarLaporan = () => {
  const { user } = useAuthStore();
  const id = user?.id;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataProgress, setDataProgress] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const fetchDataLaporan = async () => {
    setLoading(true);
    try {
      const response = await getLaporanUser(id);

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

  // Fungsi untuk mengelompokkan laporan berdasarkan bulan
  const groupByMonth = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.tanggal);
      const monthYear = date.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(item);
      return acc;
    }, {});
  };

  // Filter data berdasarkan tanggal yang dipilih
  let filteredData = selectedDate
    ? data.filter((item) => {
        const formattedItemDate = new Date(item.tanggal)
          .toISOString()
          .split("T")[0];
        return formattedItemDate === selectedDate;
      })
    : data;

  // Filter data berdasarkan status_selesai
  filteredData = selectedStatus
    ? filteredData.filter((item) => item.status_selesai === selectedStatus)
    : filteredData;

  const totalLaporan = dataProgress.length;
  const selesaiCount = dataProgress.filter(
    (item) => item.status_selesai === "Selesai"
  ).length;
  const belumCount = totalLaporan - selesaiCount;

  const progress = totalLaporan > 0 ? (selesaiCount / totalLaporan) * 100 : 0;

  const groupedData = groupByMonth(filteredData);

  if (loading) return <Loading />;

  return (
    <div className="">
      {totalLaporan > 0 && (
        <>
          <div className="flex justify-between items-center gap-2 mb-6">
            <div className=" text-xs md:w-full lg:w-full w-36">
              <label className="block mb-2">Tanggal:</label>
              <input
                type="date"
                value={selectedDate}
                placeholder="Pilih Tanggal"
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full md:w-full text-black p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="text-xs md:w-full lg:w-full w-36">
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
              Progres Laporan: {progress.toFixed(1)}%
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

      {filteredData.length === 0 ? (
        <NotfoundData />
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedData).map((monthYear, index) => (
            <div
              key={index}
              className="bg-white py-2 px-3 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">
                <div className="flex items-center gap-2 text-blue">
                  <FaCalendar />
                  <p>{monthYear}</p>
                </div>
              </h2>
              <ul className="space-y-2">
                {groupedData[monthYear].map((item, idx) => (
                  <div className="flex border-b py-2 justify-between" key={idx}>
                    <li className="text-blue-600 text-lg font-medium ">
                      <div className="flex items-center gap-2 text-blue">
                        <FaCircle size={10} color="red" />
                        <p className="text-sm">{formatDate(item.tanggal)}</p>
                      </div>
                    </li>
                    <Link
                      to={`/app/laporan/${item.id}`}
                      className="flex hover:opacity-85 transition-all cursor-pointer items-center gap-2 bg-blue px-4 rounded-md text-white text-xs"
                    >
                      <FaClipboardList />
                      <p>Laporan</p>
                    </Link>
                  </div>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DaftarLaporan;
