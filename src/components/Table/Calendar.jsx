import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // Plugin untuk tampilan grid bulanan
import { FaCalendar } from "react-icons/fa";
const Calendar = ({ data }) => {
  const absensiFormatted = data.Absensi.map((absen) => ({
    ...absen,
    tanggal: new Date(absen.tanggal).toISOString().split("T")[0],
    dateObj: new Date(absen.tanggal),
  }));

  const minDate =
    absensiFormatted.length > 0
      ? Math.min(...absensiFormatted.map((absen) => absen.dateObj))
      : new Date();

  const events = absensiFormatted.map((absen) => ({
    title: absen.hadir ? "Hadir" : "Tidak Hadir",
    date: absen.tanggal,
    backgroundColor: absen.hadir ? "green" : "red",
    textColor: "white",
  }));

  const maxDate = new Date(
    Math.max(...absensiFormatted.map((absen) => absen.dateObj))
  );
  maxDate.setMonth(maxDate.getMonth() + 1);
  return (
    <div className="mt-8 pb-8">
      <h2 className="text-xl font-semibold mb-8">
        <div className="flex items-center gap-2">
          <FaCalendar />
          <p>Kalendar Absensi</p>
        </div>
      </h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        validRange={{
          start: new Date(minDate).toISOString().split("T")[0],
          end: maxDate.toISOString().split("T")[0],
        }}
        events={events}
        eventContent={(eventInfo) => {
          return (
            <div className="flex flex-col items-center text-xs">
              <span className="text-center">{eventInfo.event.title}</span>
            </div>
          );
        }}
        eventClassNames={(event) => {
          return event.event.title === "Hadir"
            ? "bg-green-500 text-xs flex flex-col items-center"
            : "bg-red-500 text-xs flex flex-col items-center";
        }}
        className="w-full sm:w-auto sm:max-w-md mx-auto"
        headerToolbar={{
          right: "prev,next",
          center: "title",
          left: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
      />
    </div>
  );
};

export default Calendar;
