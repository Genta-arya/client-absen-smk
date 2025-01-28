import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendar,
  FaCircle,
} from "react-icons/fa";
import useAuthStore from "../../Lib/Zustand/AuthStore";
import { useNavigate } from "react-router-dom";

const Calendar = ({ data }) => {
  const { user } = useAuthStore();
  const tanggal = user.tanggal;
  const mapData = user?.Pkl?.map((item) => item);
  const filterData = mapData?.filter((item) => item.isDelete === false);
  const dataAbsen = filterData?.[0]?.absensi || [];
  const dataShift = dataAbsen[0]?.shift;
  const jamKeluar = dataShift?.jamPulang;
  const jamMasuk = dataShift?.jamMasuk;

  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const [monthName, setMonthName] = useState("");
  const absensiFormatted = data.map((absen) => ({
    ...absen,
    tanggal: new Date(absen.tanggal).toISOString().split("T")[0],
    dateObj: new Date(absen.tanggal),
  }));

  const minDate =
    absensiFormatted.length > 0
      ? Math.min(...absensiFormatted.map((absen) => absen.dateObj))
      : new Date();
  const events = absensiFormatted
    .map((absen) => {
      let timeFormattedDatang = "";
      let timeFormattedPulang = "";
      let bgColorDatang = "";
      let textColorDatang = "";
      let bgColorPulang = "gray";
      let textColorPulang = "";

      // Cek waktu datang
      if (absen.hadir === "hadir" && absen.datang) {
        const datangDate = new Date(absen.datang); // Mengonversi string datang menjadi objek Date
        const hoursDatang = datangDate.getHours(); // Ambil jam datang
        const minutesDatang = datangDate.getMinutes(); // Ambil menit datang
        timeFormattedDatang = `${hoursDatang
          .toString()
          .padStart(2, "0")}:${minutesDatang.toString().padStart(2, "0")}`; // Format waktu datang

        const batasJamPlus2 = new Date(jamMasuk);
        batasJamPlus2.setHours(batasJamPlus2.getHours() + 2);
        const hoursBatas = batasJamPlus2.getHours();
        const minutesBatas = batasJamPlus2.getMinutes();
        const timeFormattedBatas = `${hoursBatas
          .toString()
          .padStart(2, "0")}:${minutesBatas.toString().padStart(2, "0")}`;

  

        if (datangDate > batasJamPlus2) {
          timeFormattedDatang = `${timeFormattedDatang}`; // Jika datang setelah jam 7:30
          bgColorDatang = "purple"; // Set background color oranye untuk Telat
          textColorDatang = "white"; // Set warna teks hitam untuk Telat
        } else {
          timeFormattedDatang = `${timeFormattedDatang}`; // Jika datang sebelum atau tepat jam 7:30
          bgColorDatang = "green"; // Set background color hijau untuk Hadir
          textColorDatang = "white"; // Set warna teks putih untuk Hadir
        }
      } else {
        timeFormattedDatang = "..."; // Jika tidak hadir atau tidak ada waktu
        bgColorDatang = absen.hadir === null ? "gray" : "red"; // Set warna untuk yang tidak hadir
        textColorDatang = "white"; // Set warna teks putih untuk yang tidak hadir
      }

      // Menambahkan waktu pulang jika ada
      if (absen.pulang) {
        const pulangDate = new Date(absen.pulang); // Mengonversi string pulang menjadi objek Date
        const hoursPulang = pulangDate.getHours(); // Ambil jam pulang
        const minutesPulang = pulangDate.getMinutes(); // Ambil menit pulang
        timeFormattedPulang = `${hoursPulang
          .toString()
          .padStart(2, "0")}:${minutesPulang.toString().padStart(2, "0")}`; // Format waktu pulang

        // Validasi waktu pulang
        const jamPulang = pulangDate.getHours();
        const batasJamPlus2 = new Date(jamKeluar);
        batasJamPlus2.setHours(batasJamPlus2.getHours() + 1);
        const hoursBatas = batasJamPlus2.getHours();
        const minutesBatas = batasJamPlus2.getMinutes();
        const timeFormattedBatas = `${hoursBatas
          .toString()
          .padStart(2, "0")}:${minutesBatas.toString().padStart(2, "0")}`;

       
        if (jamPulang < batasJamPlus2) {
          timeFormattedPulang = `${timeFormattedPulang}`; // Jika pulang sebelum jam 16:00
          bgColorPulang = "orange"; // Set warna latar belakang kuning untuk Pulang Cepat
          textColorPulang = "white"; // Set warna teks hitam untuk Pulang Cepat
        } else {
          timeFormattedPulang = `${timeFormattedPulang}`; // Jika pulang setelah jam 16:00
          bgColorPulang = "sky"; // Set warna latar belakang biru untuk Pulang Normal
          textColorPulang = "white"; // Set warna teks putih untuk Pulang Normal
        }
      } else {
        timeFormattedPulang = "..."; // Jika tidak ada waktu pulang
        bgColorPulang = absen.hadir !== "tidak_hadir" ? "gray" : "red"; // Set warna latar belakang gray jika belum ada pulang
        textColorPulang = "white"; // Set warna teks putih
      }

      return [
        {
          title: `${timeFormattedDatang}`, // Menampilkan waktu datang
          date: absen.tanggal,
          groupId: absen.id,
          backgroundColor: bgColorDatang, // Menggunakan warna latar belakang datang
          color: textColorDatang, // Menggunakan warna teks datang
        },
        {
          title: `${timeFormattedPulang}`, // Menampilkan waktu pulang
          date: absen.tanggal,
          groupId: absen.id,
          backgroundColor: bgColorPulang,
          color: textColorPulang, 
        },
      ];
    })
    .flat(); 

  const maxDate = new Date(
    Math.max(...absensiFormatted.map((absen) => absen.dateObj))
  );
  maxDate.setMonth(maxDate.getMonth() + 1);

  const handleDateClick = (info) => {
    // Mendapatkan ID dari event yang dipilih
    const eventId = info.event.groupId; // ID dapat diambil dari groupId atau field lain
    // Navigasi ke halaman dengan format /:id
    if (user?.role === "user") {
      navigate(`/app/info/absensi/${eventId}`);
    } else {
      navigate(`/admin/info/absensi/${eventId}`);
    }
  };

  const handlePrevMonth = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
    }
  };

  const handleNextMonth = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
    }
  };

  const handleDatesSet = (arg) => {
    const currentMonth = arg.view.title; // Mendapatkan nama bulan dari FullCalendar
    setMonthName(currentMonth); // Mengupdate state dengan nama bulan
  };

  return (
    <div className="mt-8 pb-8">
      <h2 className="text-xl font-semibold mb-8">
        <div className="flex items-center gap-2">
          <FaCalendar />
          <p>Kalender Absensi</p>
        </div>
      </h2>

      <div className="mt-4 p-4 mb-8 border border-gray-300 rounded-lg">
        <h1 className="text-xl font-semibold mb-4"> ~ Info Kehadiran </h1>
        <p className="text-sm">
          <span className="flex items-center gap-2">
            <FaCircle className="text-red-500" />
            Merah menandakan Tidak Hadir
          </span>
        </p>
        <p className="text-sm mt-2">
          <span className="flex items-center gap-2">
            <FaCircle className="text-green-500" />
            Hijau menandakan Kehadiran
          </span>
        </p>
        <p className="text-sm mt-2">
          <span className="flex items-center gap-2">
            <FaCircle className="text-purple-600" />
            Ungu menandakan Terlambat Masuk
          </span>
        </p>
        <p className="text-sm mt-2">
          <span className="flex items-center gap-2">
            <FaCircle className="text-sky-500" />
            Biru menandakan Pulang
          </span>
        </p>
        <p className="text-sm mt-2">
          <span className="flex items-center gap-2">
            <FaCircle className="text-orange-500" />
            Oren menandakan Pulang cepat
          </span>
        </p>
      </div>

      <div className="flex justify-between mb-4">
        {/* Tombol Kustom untuk navigasi bulan */}
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 bg-blue disabled:bg-gray-500 text-white rounded-lg"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-blue disabled:bg-gray-500 text-white rounded-lg"
        >
          <FaArrowRight />
        </button>
      </div>
      <div className="mb-4 text-center lg:text-lg md:text-lg text-sm font-semibold">
        {monthName ? monthName : "Nama Bulan"}
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        validRange={{
          start: new Date(minDate).toISOString().split("T")[0],
          end: maxDate.toISOString().split("T")[0],
        }}
        events={events}
        eventClick={handleDateClick}
        eventContent={(eventInfo) => {
          return (
            <div className="flex flex-col cursor-pointer hover:opacity-80 ">
              <span className="text-center text-xs">
                {eventInfo.event.title}
              </span>
              
            </div>
          );
        }}
        headerToolbar={{
          right: "",
          center: "",
          left: "",
          end: "",
          start: "",
        }}
        datesSet={handleDatesSet}
      />
    </div>
  );
};

export default Calendar;
