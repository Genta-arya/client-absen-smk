import React, { useEffect, useRef, useState } from "react";
import { ResponseHandler } from "../../../Utils/ResponseHandler";
import { getAllPklRole } from "../../../Api/Services/PKLServices";
import useAuthStore from "../../../Lib/Zustand/AuthStore";
import { DateTime } from "luxon";
import Loading from "../../../components/Loading";
import { FaPrint, FaTag, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import NotfoundData from "../../../components/NotfoundData";
import { useReactToPrint } from "react-to-print";
import PrintDaftarPKL from "./PrintDaftarPKl";
import ScrollTop from "../../../components/ScrollTop";

export function formatJam(jam) {
  // Pastikan jam adalah string dalam format ISO, contohnya "2025-02-28T00:00:00.000Z"
  const date = new Date(jam); // Membuat objek Date dari waktu ISO
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }); // Format 24 jam
}

const ListPKL = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedPKL, setExpandedPKL] = useState(null); // 🔥 State untuk kontrol show/hide anggota
  const { user } = useAuthStore();
  const [isPrinting, setIsPrinting] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const [enableToTop, setEnableToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setEnableToTop(true);
      } else {
        setEnableToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllPklRole({ role: user?.role });
      setData(response.data);
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, []);

  const componentRef = useRef();

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.creator?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? item.status : !item.status);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="lg:p-6 md:p-6 p-2 -mt-4">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Cari nama PKL atau nama pembimbing..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      <div className="flex justify-between items-center">
        <p>
          Jumlah PKL: <b>{filteredData.length}</b>
        </p>

        <>
          {!isPrinting ? (
            <div
              onClick={() => setIsPrinting(true)}
              className=" cursor-pointer flex text-xs gap-2 items-center bg-blue w-fit px-4 py-1 rounded-md text-white"
            >
              <FaPrint />
              <p>Cetak PKL</p>
            </div>
          ) : (
            <div
              onClick={() => setIsPrinting(false)}
              className=" cursor-pointer flex text-xs gap-2 items-center bg-red-500 w-fit px-4 py-1 rounded-md text-white"
            >
              <p>Batal</p>
            </div>
          )}
        </>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="mt-4 space-y-4">
          {isPrinting ? (
            <PrintDaftarPKL data={filteredData} ref={componentRef} />
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  <div className="flex gap-2 items-center">
                    <FaTag />
                    <p>{item.name}</p>
                  </div>
                </h3>
                <p className="text-gray-600">{item.alamat}</p>

                {/* Status */}
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-lg mt-2 ${
                    item.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status ? "Aktif" : "Tidak Aktif"}
                </span>

                {/* Creator Info */}
                <div className="flex items-center mt-3">
                  <img
                    src={item.creator?.avatar}
                    alt={item.creator?.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <p className="text-sm text-gray-700">{item.creator?.name}</p>
                </div>

                {/* Periode */}
                <p className="text-sm text-gray-600 mt-2">
                  Periode:{" "}
                  <span className="font-medium">
                    {DateTime.fromISO(item.tanggal_mulai).toFormat(
                      "dd LLL yyyy"
                    )}{" "}
                    -{" "}
                    {DateTime.fromISO(item.tanggal_selesai).toFormat(
                      "dd LLL yyyy"
                    )}
                  </span>
                </p>

                {/* WhatsApp Group Link */}
                {item.link_grup && (
                  <p className="mt-2">
                    <a
                      href={item.link_grup}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      <div className="flex gap-2 items-center">
                        <FaWhatsapp className="text-green-500 text-xl" />
                        <p>
                          <b>Grup WhatsApp</b>
                        </p>
                      </div>
                    </a>
                  </p>
                )}

                {/* Tombol Show/Hide Anggota */}
                <div className="flex justify-center">
                  <button
                    onClick={() =>
                      setExpandedPKL(expandedPKL === item.id ? null : item.id)
                    }
                    className="mt-3 flex justify-center px-4  py-1 text-xs font-semibold bg-blue text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    {expandedPKL === item.id ? "Tutup" : "Lihat Anggota"}
                  </button>
                </div>

                {/* Daftar Anggota */}
                {expandedPKL === item.id && (
                  <div className="mt-4 border-t pt-3">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">
                      Siswa PKL ({item.users.length})
                    </h4>
                    {item.users.length > 0 ? (
                      <ul className="space-y-2">
                        {item.users.map((user, index) => (
                          <li
                            key={index}
                            className="flex justify-between  items-center gap-3 p-2 bg-gray-100 rounded-lg"
                          >
                            <div className="flex gap-2 items-center">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="text-gray-800 font-medium">
                                  {user.name}
                                </p>
                                <p className="text-gray-800 font-medium">
                                  {user.Kelas[0]?.nama || "-"}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Shift {user.Absensi[0]?.pkl.shifts[0]?.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {formatJam(
                                    user.Absensi[0]?.pkl.shifts[0]?.jamMasuk
                                  )}{" "}
                                  -{" "}
                                  {formatJam(
                                    user.Absensi[0]?.pkl.shifts[0]?.jamPulang
                                  )}
                                </p>
                              </div>
                            </div>

                            <Link
                              to={`/admin/detail/profile/${
                                user.id
                              }/${user.name.replace(/ /g, "-")}`}
                            >
                              <button className="px-4 py-1 text-xs font-semibold bg-blue text-white rounded-lg hover:bg-blue-600 transition">
                                Detail
                              </button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">Belum ada anggota.</p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <NotfoundData />
          )}
        </div>
      )}
      <ScrollTop scrollToTop={scrollToTop} enable={enableToTop} />
    </div>
  );
};

export default ListPKL;
