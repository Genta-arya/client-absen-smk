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
import { DateTime } from "luxon";
import { div, p } from "framer-motion/m";
import ScrollTop from "../ScrollTop";
import AbsensiTab from "./TabCalender";
const Calendar = ({ data }) => {
  const { user } = useAuthStore();
  const mapData = user?.Pkl?.map((item) => item);
  const filterData = mapData?.filter((item) => item.isDelete === false);
  const dataAbsen = filterData?.[0]?.absensi || [];
  const dataShift = dataAbsen[0]?.shift;
  const jamKeluar = dataShift?.jamPulang;
  const jamMasuk = dataShift?.jamMasuk;
  const [toTop, setToTop] = useState(false);

  const absensiAdmin = user?.role !== "user" ? data : [];
  const absensi = user?.Pkl?.flatMap((pkl) => pkl.absensi) || [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setToTop(true);
      } else {
        setToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const [monthName, setMonthName] = useState("");
  const absensiFormatted = data.map((absen) => ({
    ...absen,
    tanggal: DateTime.fromISO(absen.tanggal).toISODate(), // Menggunakan Luxon untuk format tanggal
    dateObj: DateTime.fromISO(absen.tanggal).toJSDate(), // Menggunakan Luxon untuk mengonversi ke JavaScript Date
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

      // Cek waktu datang menggunakan Luxon
      if (
        absen.hadir === "hadir" ||
        (absen.hadir === "selesai" && absen.datang)
      ) {
        const datangDate = DateTime.fromISO(absen.datang, {
          zone: "UTC",
        }).setZone("Asia/Jakarta");

        timeFormattedDatang = datangDate.toFormat("HH:mm");

        const batasJamPlus2 = DateTime.fromISO(jamMasuk, {
          zone: "Asia/Jakarta",
        }).plus({ minutes: 15 });

        const batasJamPlus15Formatted = batasJamPlus2.toFormat("HH:mm");

        if (timeFormattedDatang > batasJamPlus15Formatted) {
          timeFormattedDatang = `${timeFormattedDatang}`; // Jika datang setelah batas
          bgColorDatang = "purple";
          textColorDatang = "white";
        } else {
          timeFormattedDatang = `${timeFormattedDatang}`; // Jika datang sebelum atau tepat batas
          bgColorDatang = "green";
          textColorDatang = "white";
        }
      } else {
        timeFormattedDatang = "...";
        bgColorDatang = absen.hadir === null ? "gray" : "red";
        textColorDatang = "white";
      }

      // Menambahkan waktu pulang menggunakan Luxon
      if (
        (absen.pulang && absen.hadir === "hadir") ||
        absen.hadir === "selesai"
      ) {
        const pulangDate = DateTime.fromISO(absen.pulang); // Menggunakan Luxon

        timeFormattedPulang = pulangDate.toFormat("HH:mm"); // Format waktu pulang menggunakan Luxon

        const batasJamPlus1 = DateTime.fromISO(jamKeluar, {
          zone: "Asia/Jakarta",
        }).plus({ hours: 1 });

        if (timeFormattedDatang > batasJamPlus1) {
          timeFormattedPulang = ` ${timeFormattedPulang}`;
          bgColorPulang = "orange";
          textColorPulang = "white";
        } else {
          timeFormattedPulang = `${timeFormattedPulang}`;
          bgColorPulang = "sky";
          textColorPulang = "white";
        }
      } else {
        timeFormattedPulang = `${
          absen.hadir === "izin"
            ? "Izin"
            : absen.hadir === "libur"
            ? "Libur"
            : absen.hadir === null
            ? "..."
            : "T"
        }`;
        timeFormattedDatang = `${
          absen.hadir === "izin"
            ? "Izin"
            : absen.hadir === "libur"
            ? "Libur"
            : absen.hadir === null
            ? "..."
            : "T"
        }`;
        bgColorPulang =
          absen.hadir === "izin" || absen.hadir === "libur"
            ? "orange"
            : absen.hadir !== "tidak_hadir"
            ? "gray"
            : "red";

        bgColorDatang =
          absen.hadir === "izin" || absen.hadir === "libur"
            ? "orange"
            : absen.hadir !== "tidak_hadir"
            ? "gray"
            : "red";

        textColorPulang = "white";
      }

      return [
        {
          title: `${timeFormattedDatang}`,
          date: absen.tanggal,
          groupId: absen.id,
          backgroundColor: bgColorDatang,
          color: textColorDatang,
        },
        {
          title: `${timeFormattedPulang}`,
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
    <div className="mt-4 pb-8">
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
            <FaCircle className="text-sky-500" />
            Biru menandakan Pulang
          </span>
        </p>
        <p className="text-sm mt-2">
          <span className="flex items-center gap-2">
            <FaCircle className="text-orange-500" />
            Oren menandakan Libur / Izin
          </span>
        </p>
      </div>

      <AbsensiTab
        absensi={user?.role === "user" ? absensi : absensiAdmin}
        user={user}
      />

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

      <ScrollTop scrollToTop={scrollToTop} enable={toTop} />
    </div>
  );
};

export default Calendar;
