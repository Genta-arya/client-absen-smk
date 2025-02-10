import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContainerGlobal from "../../../ContainerGlobal";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import { rekababsensi } from "../../../../Api/Services/AbsensiServices";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DateTime } from "luxon";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import Loading from "../../../Loading";

const MainRekababsensi = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await rekababsensi(id);
      setData(response.data);
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter(
    (item) =>
      item.user.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    const dates = [...new Set(data.map((item) => item.tanggal))]
      .map((date) => formatTanggal(date))
      .sort();

    const rowData = {};

    data.forEach((item) => {
      const nama = item.user.name;
      const formattedDate = formatTanggal(item.tanggal);

      if (!rowData[nama]) {
        rowData[nama] = { Nama: nama };
        dates.forEach((date) => {
          rowData[nama][date] = "";
        });
      }

      rowData[nama][formattedDate] = item.hadir || "Tidak Hadir";
    });

    // Konversi data ke array untuk dijadikan sheet
    const rows = Object.values(rowData);

    // Konversi ke sheet Excel
    const ws = XLSX.utils.json_to_sheet(rows, { header: ["Nama", ...dates] });
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Absensi");
    XLSX.writeFile(wb, "Rekap_Absensi.xlsx");
  };
  const exportPDF = () => {
    const doc = new jsPDF();

    const firstData = data[0]; // Ambil dari entri pertama
    const namaPkl = firstData.pkl.name;
    const namaPembimbing = firstData.pkl.creator.name;
    const periode = `${formatTanggal(
      firstData.pkl.tanggal_mulai.split("T")[0]
    )} - ${formatTanggal(firstData.pkl.tanggal_selesai.split("T")[0])}`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("REKAP ABSENSI", 105, 10, { align: "center" }); // Pindah ke atas agar tidak bertabrakan

    doc.setFontSize(14);
    doc.text("SMK 2 NEGERI KETAPANG", 105, 16, { align: "center" });

    doc.setFontSize(8);
    doc.text(
      "JL. Jenderal Gatot Subroto, Matan Hilir Utara, Payah Kumang, Delta Pawan, Kabupaten Ketapang, Kalimantan Barat 78851",
      105,
      20,
      { align: "center" }
    );

    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25); // Garis bawah kop surat

    const marginLeft = 15; // Margin kiri
    const labelWidth = 50; // Lebar tetap untuk label agar titik dua sejajar
    const marginTop = 30; // Margin atas setelah kop surat
    const lineSpacing = 5; // Jarak antar baris

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Menampilkan informasi dengan margin atas dan spasi antar baris
    doc.text(`Nama PKL`, marginLeft, marginTop);
    doc.text(`: ${namaPkl}`, marginLeft + labelWidth, marginTop);

    doc.text(`Nama Pembimbing`, marginLeft, marginTop + lineSpacing);
    doc.text(
      `: ${namaPembimbing}`,
      marginLeft + labelWidth,
      marginTop + lineSpacing
    );

    doc.text(`Periode`, marginLeft, marginTop + 2 * lineSpacing);
    doc.text(
      `: ${periode}`,
      marginLeft + labelWidth,
      marginTop + 2 * lineSpacing
    );

    doc.autoTable({
      startY: 43,
      head: [["NIM", "Nama", "Kelas", "Ket", "Tanggal"]],
      body: data.map((item) => [
        item.user.nim,
        item.user.name,
        item.user.Kelas.map((k) => k.nama).join(", "),
        item.hadir || "Tidak Hadir",
        item.tanggal ? formatTanggal(item.tanggal) : "-",
      ]),
      headStyles: {
        fillColor: [41, 74, 112],
        textColor: "#ffffff",
      },
      theme: "grid",
    });

    doc.save("Rekap_Absensi.pdf");
  };

  const formatTanggal = (tanggal) => {
    return DateTime.fromISO(tanggal)
      .setLocale("id")
      .toFormat("cccc, dd LLLL yyyy");
  };
  const formatJam = (jam) => {
    return DateTime.fromISO(jam).toFormat("HH:mm");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ContainerGlobal title="Rekap Absensi">
      <div className="">
        <div className="flex gap-4 mb-4">
          <button
            onClick={exportExcel}
            className="bg-green-500 text-white px-4 py-2 text-xs rounded hover:bg-green-600"
          >
            <div className="flex items-center gap-2">
              <FaFileExcel />
              <p>Export Excel</p>
            </div>
          </button>
          <button
            onClick={exportPDF}
            className="bg-red-500 text-xs text-white px-4  rounded hover:bg-red-600"
          >
            <div className="flex items-center gap-2">
              <FaFilePdf />
              <p>Print PDF</p>
            </div>
          </button>
        </div>

        <input
          type="text"
          placeholder="Cari NIM atau Nama"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full text-xs e px-4 py-2 border mb-8 border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">No</th>
                <th className="border border-gray-300 px-4 py-2">NIM</th>
                <th className="border border-gray-300 px-4 py-2">Nama</th>
                <th className="border border-gray-300 px-4 py-2">Kelas</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Tanggal</th>
                <th className="border border-gray-300 px-4 py-2">Shift</th>
                <th className="border border-gray-300 px-4 py-2">Jam Masuk</th>
                <th className="border border-gray-300 px-4 py-2">Jam Pulang</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.user.nim}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.user.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.user.Kelas.map((k) => k.nama).join(", ")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.hadir || "Tidak Hadir"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.tanggal ? formatTanggal(item.tanggal) : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.user.shifts.length > 0
                      ? item.user.shifts[0].name
                      : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.user.shifts.length > 0
                      ? formatJam(item.user.shifts[0].jamMasuk)
                      : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.user.shifts.length > 0
                      ? formatJam(item.user.shifts[0].jamPulang)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ContainerGlobal>
  );
};

export default MainRekababsensi;
