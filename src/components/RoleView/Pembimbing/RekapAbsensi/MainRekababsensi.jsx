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
import { toast } from "sonner";
import NotfoundData from "../../../NotfoundData";

const MainRekababsensi = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    DateTime.now().toFormat("yyyy-MM")
  );

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

  const filteredData = data
    .filter(
      (item) =>
        item.tanggal.startsWith(selectedMonth) &&
        (item.user.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => DateTime.fromISO(a.tanggal) - DateTime.fromISO(b.tanggal));

  const exportExcel = () => {
    if (selectedMonth.length === 0) {
      return toast.info("Pilih bulan terlebih dahulu");
    }

    if (searchQuery === "") {
      return toast.info(
        "Masukkan NISN atau Nama Siswa dipencarian terlebih dahulu"
      );
    }
    const wb = XLSX.utils.book_new();

    const dates = [...new Set(filteredData.map((item) => item.tanggal))]
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

      rowData[nama][formattedDate] =
        item.hadir === "selesai"
          ? "Hadir"
          : item.hadir === "tidak_hadir"
          ? "Tidak Hadir"
          : "-";
    });

    // Konversi data ke array untuk dijadikan sheet
    const rows = Object.values(rowData);

    // Konversi ke sheet Excel
    const ws = XLSX.utils.json_to_sheet(rows, { header: ["Nama", ...dates] });
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Absensi");
    XLSX.writeFile(wb, "Rekap_Absensi.xlsx");
  };
  // const exportPDF = () => {
  //   const doc = new jsPDF();

  //   const firstData = filteredData[0]; // Ambil dari entri pertama
  //   const namaPkl = firstData.pkl.name;
  //   const namaPembimbing = firstData.pkl.creator.name;
  //   const periode = `${formatTanggal(
  //     firstData.pkl.tanggal_mulai.split("T")[0]
  //   )} - ${formatTanggal(firstData.pkl.tanggal_selesai.split("T")[0])}`;

  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(16);
  //   doc.text("REKAP ABSENSI", 105, 10, { align: "center" }); // Pindah ke atas agar tidak bertabrakan

  //   doc.setFontSize(14);
  //   doc.text("SMK 2 NEGERI KETAPANG", 105, 16, { align: "center" });

  //   doc.setFontSize(8);
  //   doc.text(
  //     "JL. Jenderal Gatot Subroto, Matan Hilir Utara, Payah Kumang, Delta Pawan, Kabupaten Ketapang, Kalimantan Barat 78851",
  //     105,
  //     20,
  //     { align: "center" }
  //   );

  //   doc.setLineWidth(0.5);
  //   doc.line(10, 25, 200, 25); // Garis bawah kop surat

  //   const marginLeft = 15; // Margin kiri
  //   const labelWidth = 50; // Lebar tetap untuk label agar titik dua sejajar
  //   const marginTop = 30; // Margin atas setelah kop surat
  //   const lineSpacing = 5; // Jarak antar baris

  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(10);

  //   // Menampilkan informasi dengan margin atas dan spasi antar baris
  //   doc.text(`Tempat PKL`, marginLeft, marginTop);
  //   doc.text(`: ${namaPkl}`, marginLeft + labelWidth, marginTop);

  //   doc.text(`Pembimbing`, marginLeft, marginTop + lineSpacing);
  //   doc.text(
  //     `: ${namaPembimbing}`,
  //     marginLeft + labelWidth,
  //     marginTop + lineSpacing
  //   );

  //   doc.text(`Periode`, marginLeft, marginTop + 2 * lineSpacing);
  //   doc.text(
  //     `: ${periode}`,
  //     marginLeft + labelWidth,
  //     marginTop + 2 * lineSpacing
  //   );

  //   doc.autoTable({
  //     startY: 43,
  //     head: [["NO", "NISN", "Nama", "Kelas", "Keterangan", "Tanggal"]],
  //     body: filteredData.map((item, index) => [
  //       index + 1,
  //       item.user.nim,
  //       item.user.name,
  //       item.user.Kelas.map((k) => k.nama).join(", ") || "-",
  //       item.hadir || "Tidak Hadir",
  //       item.tanggal ? formatTanggal(item.tanggal) : "-",
  //     ]),
  //     headStyles: {
  //       fillColor: [41, 74, 112],
  //       textColor: "#ffffff",
  //     },
  //     theme: "grid",
  //   });

  //   doc.save("Rekap_Absensi.pdf");
  // };

  console.log(selectedMonth);

  const exportPDF = () => {
    const doc = new jsPDF();
    if (selectedMonth.length === 0) {
      return toast.info("Pilih bulan terlebih dahulu");
    }

    if (searchQuery === "") {
      return toast.info(
        "Masukkan NISN atau Nama Siswa dipencarian terlebih dahulu"
      );
    }

    const firstData = filteredData[0]; // Ambil dari entri pertama
    const namaPkl = firstData.pkl.name;
    const namaPembimbing = firstData.pkl.creator.name;
    const startDate = firstData.pkl.tanggal_mulai.split("T")[0];
    const endDate = firstData.pkl.tanggal_selesai.split("T")[0];

    let periode;
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      const firstDay = `${year}-${month}-01`;
      const lastDay = DateTime.fromISO(firstDay).endOf("month").toISODate();

      periode = `${formatTanggal(firstDay)} - ${formatTanggal(lastDay)}`;
    } else {
      periode = `${formatTanggal(startDate)} - ${formatTanggal(endDate)}`;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("REKAP ABSENSI", 105, 10, { align: "center" });

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

    const marginLeft = 15;
    const labelWidth = 50;
    const marginTop = 30;
    const lineSpacing = 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Menampilkan informasi
    doc.text(`Tempat PKL`, marginLeft, marginTop);
    doc.text(`: ${namaPkl}`, marginLeft + labelWidth, marginTop);

    doc.text(`Pembimbing`, marginLeft, marginTop + lineSpacing);
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
      head: [["NO", "NISN", "Nama", "Kelas", "Keterangan", "Tanggal"]],
      body: filteredData.map((item, index) => [
        index + 1,
        item.user.nim,
        item.user.name,
        item.user.Kelas.map((k) => k.nama).join(", ") || "-",
        item.hadir === "selesai"
          ? "Hadir"
          : item.hadir === "tidak_hadir"
          ? "Tidak Hadir"
          : "-",
        item.tanggal ? formatTanggal(item.tanggal) : "-",
      ]),
      headStyles: {
        fillColor: [41, 74, 112],
        textColor: "#ffffff",
        halign: "center",
      },
      styles: {
        halign: "center",
      },
      theme: "grid",
    });

    // === Tambahkan form tanda tangan ===
    const yPos = doc.autoTable.previous.finalY + 20; // Ambil posisi terakhir dari tabel
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(10);
    doc.text("Mengetahui,", marginLeft, yPos);
    doc.text(
      "Ketapang, " + DateTime.now().toFormat("dd LLLL yyyy"),
      pageWidth - 60,
      yPos
    ); // Tanggal di sisi kanan

    const tandaTanganY = yPos + 25; // Posisi garis tanda tangan

    // Garis untuk tanda tangan
    doc.line(marginLeft, tandaTanganY, marginLeft + 50, tandaTanganY); // Pembimbing
    doc.line(pageWidth - 80, tandaTanganY, pageWidth - 30, tandaTanganY); // Kepala Sekolah

    // Nama di bawah tanda tangan
    doc.text("Pembimbing PKL", marginLeft, tandaTanganY + 5);
    doc.text(namaPembimbing, marginLeft, tandaTanganY + 10);

    doc.text("Kepala Sekolah", pageWidth - 80, tandaTanganY + 5);
    doc.text("Trisno, ST", pageWidth - 80, tandaTanganY + 10); // Ganti dengan nama kepala sekolah

    doc.save("Rekap_Absensi.pdf");
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const formatTanggal = (tanggal) => {
    return DateTime.fromISO(tanggal).setLocale("id").toFormat("dd LLLL yyyy");
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
        <div className="flex  gap-4 mb-4 w-full">
          <button
            onClick={exportExcel}
            disabled={filteredData.length === 0}
            className="bg-green-500 disabled:bg-gray-500 text-white px-4 py-2 text-xs rounded hover:bg-green-600"
          >
            <div className="flex items-center gap-2">
              <FaFileExcel />
              <p>Export Excel</p>
            </div>
          </button>
          <button
            onClick={exportPDF}
            disabled={filteredData.length === 0}
            className="bg-red-500 disabled:bg-gray-500 text-xs text-white px-4  rounded hover:bg-red-600"
          >
            <div className="flex items-center gap-2">
              <FaFilePdf />
              <p>Print PDF</p>
            </div>
          </button>
        </div>
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="text-xs px-4 mb-2 py-2 border w-full border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        />

        <input
          type="text"
          placeholder="Cari NISN atau Nama"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full text-xs e px-4 py-2 border mb-8 border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">No</th>
                <th className="border border-gray-300 px-4 py-2">NISN</th>
                <th className="border border-gray-300 px-4 py-2">Nama</th>
                <th className="border border-gray-300 px-4 py-2">Kelas</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <NotfoundData />
                  </td>
                </tr>
              ) : (
                <>
                  {filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className={`text-center ${
                        item.hadir === "selesai"
                          ? "bg-green-500 text-white"
                          : item.hadir === "tidak_hadir"
                          ? "bg-red-500 text-white"
                          : ""
                      }`}
                    >
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
                        {item.user.Kelas.map((k) => k.nama).join(", ") || "-"}
                      </td>
                      <td
                        className={`border border-gray-300 px-4 py-2 font-bold ${
                          item.hadir === "selesai"
                            ? ""
                            : item.hadir === null || item.hadir === undefined
                            ? "text-gray-500"
                            : ""
                        }`}
                      >
                        {item.hadir === "selesai"
                          ? "Hadir"
                          : item.hadir === "tidak_hadir"
                          ? "Tidak Hadir"
                          : "-"}
                      </td>

                      <td className="border border-gray-300 px-4 py-2">
                        {item.tanggal ? formatTanggal(item.tanggal) : "-"}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ContainerGlobal>
  );
};

export default MainRekababsensi;
