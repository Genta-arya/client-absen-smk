import React, { useState, useEffect } from "react";
import ContainerGlobal from "../../../ContainerGlobal";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { formatTanggal } from "../../../../constants/Constants";
import { FaArrowUp, FaCalendarMinus, FaClock, FaTag } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";
import {
  HandleHadir,
  handlePulangs,
} from "../../../../Api/Services/AbsensiServices";
import { handleError } from "../../../../Utils/Error";
import ActModal from "../../../Modal/ActModal";
import ModalAbsens from "./ModalAbsens";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import { toast } from "sonner";
import LoadingButton from "../../../LoadingButton";

const DetailAbsensi = () => {
  const { user } = useAuthStore();
  const mapData = user?.Pkl?.map((item) => item);
  const filterData = mapData?.filter((item) => item.isDelete === false);
  const [modal, setModal] = useState(false);
  const [selectData, setSelectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const tanggal = user.DateIndonesia;
  const data = filterData?.[0]?.absensi || [];
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date(user?.tanggal).toISOString().split("T")[0];
  });

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

  const firstDate = data[0]?.tanggal;
  const maxDate = firstDate.split("T")[0];

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
    const toUTC7 = (inputDate) => {
      // Konversi waktu dari UTC ke UTC+7
      return new Date(inputDate.getTime() + 7 * 60 * 60 * 1000);
    };

    const selectedDate = toUTC7(new Date(date)); // Tanggal yang dipilih
    const serverDate = toUTC7(new Date(user?.DateIndonesia)); // Tanggal server disesuaikan ke UTC+7
    // const serverDate = toUTC7(new Date(tanggal));

    const serverHours = serverDate.getUTCHours(); // Jam server di zona UTC+7
    const serverMinutes = serverDate.getUTCMinutes(); // Menit server di zona UTC+7

    // Rentang waktu yang diizinkan: 06:30 - 12:00 UTC+7
    const isWithinMasukTime =
      (serverHours === 7 && serverMinutes >= 0) ||
      (serverHours > 7 && serverHours < 10) ||
      (serverHours === 10 && serverMinutes === 0);

    if (!isWithinMasukTime) {
      return true; // Tombol disabled jika tidak berada dalam rentang waktu
    }

    // Format tanggal untuk perbandingan
    const formatDate = (d) => {
      const day = d.getUTCDate().toString().padStart(2, "0");
      const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
      const year = d.getUTCFullYear();
      return `${day}-${month}-${year}`;
    };

    if (formatDate(selectedDate) !== formatDate(serverDate)) {
      return true; // Tombol disabled jika tanggal tidak sama dengan tanggal server
    }

    return false; // Tombol diaktifkan jika berada dalam kondisi yang diperbolehkan
  };

  const modalAbsen = (data) => {
    setModal(!modal);
    setSelectData(data);
  };

  const isCheckoutDisabled = (date) => {
    const toUTC7 = (inputDate) => {
      return new Date(inputDate.getTime() + 7 * 60 * 60 * 1000); // Konversi ke UTC+7
    };

    // Ambil tanggal yang dipilih dan server tanggal
    const selectedDate = new Date(date); // Tanggal dari input pengguna
    const serverDate = toUTC7(new Date(user?.DateIndonesia)); // Tanggal server dikonversi ke UTC+7

    const serverHours = serverDate.getUTCHours(); // Jam dari server
    const serverMinutes = serverDate.getUTCMinutes(); // Menit dari server

    // Rentang waktu checkout dari 15:30 - 23:59
    const isWithinPulangTime =
      (serverHours === 15 && serverMinutes >= 30) || // Jam 15:30 - 15:59
      (serverHours > 16 && serverHours < 17) || // Jam 16:00 - 17:59
      (serverHours === 17 && serverMinutes === 0); // Tepat jam 18:00

    if (!isWithinPulangTime) {
      return true; // Tombol dinonaktifkan jika tidak dalam rentang waktu
    }

    // Format tanggal ke dd-MM-yyyy untuk perbandingan
    const formatDate = (d) => {
      const day = d.getUTCDate().toString().padStart(2, "0");
      const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
      const year = d.getUTCFullYear();
      return `${day}-${month}-${year}`;
    };

    // Perbandingan tanggal dengan format Indonesia (dd-MM-yyyy)
    if (formatDate(selectedDate) !== formatDate(serverDate)) {
      return true; // Tombol dinonaktifkan jika tanggal tidak sesuai
    }

    return false; // Tombol diaktifkan jika memenuhi semua syarat
  };

  const getStatusClass = (hadir) => {
    if (hadir === "hadir") return "bg-green-600 font-bold";
    if (hadir === "tidak_hadir") return "bg-red-600 font-bold";
    return "bg-gray-500";
  };

  const getStatusText = (hadir, time) => {
    const currentDate = new Date(time); // Tanggal yang diberikan

    // Manipulasi waktu
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    if (hadir === "hadir") return `Sudah Hadir (${hours}:${minutes})`;
    if (hadir === "tidak_hadir") return `Tidak Hadir (${hours}:${minutes})`;
    return `Belum absen`;
  };

  const toUTC7 = (date) => {
    const localDate = new Date(date);
    const utc7Date = new Date(localDate.getTime() + 7 * 60 * 60 * 1000);
    return utc7Date.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }); // Format lokal
  };

  const utcDate = new Date("2025-01-22T12:00:00Z");
  console.log(toUTC7(utcDate));

  // Fungsi untuk scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePulang = async (id) => {
    setLoading(true);
    const currentDate = new Date(tanggal); // Tanggal yang diberikan

    // Manipulasi waktu
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Pastikan format ISO
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    currentDate.setSeconds(seconds);

    const isoString = currentDate.toISOString();
    try {
      await handlePulangs({
        id: id,
        jam_pulang: isoString,
      });
      toast.success("Berhasil absen pulang");
      window.location.reload();
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
      }
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
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
            // disable clear
            onWheel={(e) => e.target.blur()}
            min={maxDate}
            max={minDate}
            onChange={(e) => {
              const value = e.target.value;
              // Pastikan hanya tanggal valid yang dipilih
              if (value !== '') {
                handleDateChange(e);
              }
            }}
          />
        </div>
      </div>
      <div className="bg-blue text-white p-4 rounded-lg mb-6">
        <h1 className="font-bold text-lg">Informasi:</h1>
        <p className="text-base font-bold"> - Absen Masuk</p>
        <p className="text-base">
          Jika sudah lewat dari jam 9:00 pagi, Anda tidak dapat absen dan
          dianggap tidak hadir.
        </p>

        <p className="text-base font-bold mt-4"> - Absen Keluar</p>
        <p className="text-base">
          Absen keluar hanya dapat dilakukan pada pukul 15:30 sampai pukul
          23:59.
        </p>
      </div>

      {Object.keys(groupedByMonth).length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>Absensi tidak tersedia untuk tanggal yang dipilih.</p>
        </div>
      ) : (
        Object.keys(groupedByMonth).map((month, index) => (
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
                  {getStatusText(absensi.hadir, absensi.datang)}
                </p>
                <div className="mt-1">
                  <button
                    onClick={() => modalAbsen(absensi.id)}
                    className="w-full flex items-center disabled:cursor-not-allowed disabled:bg-gray-500 justify-center cursor-pointer text-sm font-bold hover:opacity-85 transition-all duration-300 ease-in-out bg-green-500 text-white rounded-md py-1"
                    disabled={
                      isDateDisabled(absensi.tanggal) ||
                      absensi.hadir === "hadir"
                    }
                  >
                    <div className="flex items-center gap-2 ">
                      <FaCalendarCheck size={18} />
                      <p>Absen Masuk</p>
                    </div>
                  </button>
                </div>
                <div className="mt-1">
                  <button
                    onClick={() => handlePulang(absensi.id)}
                    className="w-full flex items-center disabled:cursor-not-allowed disabled:bg-gray-500 justify-center cursor-pointer text-sm font-bold hover:opacity-85 transition-all duration-300 ease-in-out bg-orange-500 text-white rounded-md py-1"
                    disabled={
                      isCheckoutDisabled(absensi.tanggal) ||
                      absensi.pulang !== null ||
                      loading
                    }
                  >
                    <div className="flex items-center gap-2 ">
                      <LoadingButton
                        icon={<FaClock size={18} />}
                        text="Absen Pulang"
                        loading={loading}
                      />
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
      {/* Tombol Scroll to Top */}
      {isScrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue text-white p-2 rounded-full shadow-lg"
        >
          <FaArrowUp />
        </button>
      )}

      {modal && (
        <ActModal
          isModalOpen={modal}
          setIsModalOpen={setModal}
          title="Absen Masuk"
        >
          {" "}
          <ModalAbsens id={selectData} tanggal={tanggal} utc={toUTC7} />
        </ActModal>
      )}
    </ContainerGlobal>
  );
};

export default DetailAbsensi;
