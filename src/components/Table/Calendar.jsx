import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { FaArrowLeft, FaArrowRight, FaCalendar, FaCircle } from "react-icons/fa";

const Calendar = ({ data }) => {
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

  const events = absensiFormatted.map((absen) => ({
    title:
      absen.hadir === "hadir" ? "..." : absen.hadir === null ? "..." : "...",
    date: absen.tanggal,
    groupId: absen.id,
    backgroundColor:
      absen.hadir === "hadir" ? "green" : absen.hadir === null ? "gray" : "red",
  }));

  const maxDate = new Date(
    Math.max(...absensiFormatted.map((absen) => absen.dateObj))
  );
  maxDate.setMonth(maxDate.getMonth() + 1);

  const handleDateClick = (info) => {
    console.log(info.event);
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
          <p>Kalendar Absensi</p>
        </div>
      </h2>

      <div className="mt-4 p-4 mb-8 border border-gray-300 rounded-lg">
        <h1 className="text-xl font-semibold mb-4"> ~ Info</h1>
        <p className="text-sm">
          <span className="flex items-center gap-2">
            <FaCircle className="text-red-500" />
            Merah menandakan Tidak Hadir
          </span>
        </p>
        <p className="text-sm mt-2">
          <span className="flex items-center gap-2">
            <FaCircle className="text-green-500" />
            Hijau menandakan kehadiran
          </span>
        </p>
        <p className="text-sm mt-2">
          <span className="flex items-center gap-2">
            <FaCircle className="text-gray-500" />
            Gray menandakan belum melakukan absensi
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
