import React, { useState, useEffect } from "react";
import ContainerGlobal from "../../../ContainerGlobal";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { formatTanggal } from "../../../../constants/Constants";
import { FaArrowUp, FaClock, FaTag } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";

const DetailAbsensi = () => {
  const { user } = useAuthStore();
  const mapData = user?.Pkl?.map((item) => item);
  const filterData = mapData?.filter((item) => item.isDelete === false);

  const tanggal = user.DateIndonesia;
  const data = filterData?.[0]?.absensi || [];
  const [selectedDate, setSelectedDate] = useState(
    new Date(tanggal).toISOString().split("T")[0]
  );
  const [isScrolled, setIsScrolled] = useState(false);

  // Menambahkan event listener untuk scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const lastDate = data[data.length - 1]?.tanggal;
  const minDate = lastDate.split("T")[0];

  // Filter data berdasarkan tanggal yang dipilih
  const filteredData = selectedDate
    ? data.filter(
        (absensi) =>
          new Date(absensi.tanggal).toISOString().split("T")[0] === selectedDate
      )
    : data;

  const groupedByMonth = filteredData.reduce((acc, absensi) => {
    const date = new Date(absensi.tanggal);
    const monthYear = date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
    });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(absensi);

    return acc;
  }, {});

  const isDateDisabled = (date) => {
    const selectedDate = new Date(date);
    const serverDate = new Date(user.DateIndonesia);

    const serverHours = serverDate.getHours();
    const serverMinutes = serverDate.getMinutes();

    const isAfter10AM =
      serverHours > 12 || (serverHours === 12 && serverMinutes >= 30);

    if (isAfter10AM) {
      return true;
    }

    if (selectedDate.toLocaleDateString() !== serverDate.toLocaleDateString()) {
      return true;
    }

    return false;
  };

  const getStatusClass = (hadir) => {
    if (hadir === true) return "bg-green-600 font-bold";
    if (hadir === false) return "bg-red-600 font-bold";
    return "bg-gray-500";
  };

  const getStatusText = (hadir) => {
    if (hadir === true) return "Sudah Hadir";
    if (hadir === false) return "Tidak Hadir";
    return "Belum Absen";
  };

  // Fungsi untuk scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ContainerGlobal>
      <div className="flex flex-col items-center mb-6">
        <div className="flex w-full justify-between items-center mb-4">
          <div className="flex text-xl text-blue gap-2 items-center justify-center">
            <FaTag />
            <h1 className="text-xl font-bold text-center uppercase">
              Absensi Saya
            </h1>
          </div>
          <input
            type="date"
            className="border border-gray-300 p-2 rounded-md shadow-sm text-xs"
            placeholder="Pilih tanggal"
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]}
            max={minDate}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div className="bg-blue text-white p-4 rounded-lg mb-6">
        <h1 className="font-bold text-lg">Informasi:</h1>
        <p className="text-base">
          Jika sudah lewat dari jam 9:00 pagi, Anda tidak dapat absen dan
          dianggap tidak hadir.
        </p>
      </div>

      {/* Menampilkan data berdasarkan bulan setelah difilter */}
      {Object.keys(groupedByMonth).map((month, index) => (
        <div key={index} className="space-y-4">
          <h2 className="text-lg font-bold text-center mt-4 underline text-red-500">
            Bulan {month}
          </h2>
          {groupedByMonth[month].map((absensi, absensiIndex) => (
            <div
              key={absensiIndex}
              className="p-4 border border-gray-300 rounded-lg shadow-sm"
            >
              <div className="mb-4 text-blue flex items-center gap-4">
                <FaClock size={30} />
                <div className="flex flex-col">
                  <p className="text-sm text-blue font-bold">
                    {formatTanggal(absensi.tanggal)}
                  </p>
                </div>
              </div>
              <p
                className={`text-xs py-1.5 text-white rounded-md text-center ${getStatusClass(
                  absensi.hadir
                )}`}
              >
                {getStatusText(absensi.hadir)}
              </p>
              <div className="mt-1">
                <button
                  className="w-full flex items-center disabled:cursor-not-allowed disabled:bg-gray-500 justify-center cursor-pointer text-sm font-bold hover:opacity-85 transition-all duration-300 ease-in-out bg-green-500 text-white rounded-md py-1"
                  disabled={isDateDisabled(absensi.tanggal)}
                >
                  <div className="flex items-center gap-2">
                    <FaCalendarCheck size={20} />
                    <p>Attendance</p>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Tombol Scroll to Top */}
      {isScrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue text-white p-2 rounded-full shadow-lg"
        >
          <FaArrowUp />
        </button>
      )}
    </ContainerGlobal>
  );
};

export default DetailAbsensi;
