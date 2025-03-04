import React, { useRef, useState, useEffect } from "react";
import { getLaporanMingguan } from "../../../../Api/Services/LaporanServices";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import { useReactToPrint } from "react-to-print";
import Loading from "../../../Loading";
import { useParams } from "react-router-dom";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import NotfoundData from "../../../NotfoundData";

const CetakLaporanRekap = () => {
  const { id } = useParams();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef(null);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const response = await getLaporanMingguan(id);
        setLaporan(response.data);
      } catch (error) {
        ResponseHandler(error.response);
      } finally {
        setLoading(false);
      }
    };
    fetchLaporan();
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Jurnal PKL Mingguan",
    removeAfterPrint: true,
    pageStyle: `
          @media print {
            @page {
              size: portrait;
              margin-top: 10mm;
            }
          }
          `,
  });

  if (loading) return <Loading />;
  if (!laporan) return <NotfoundData />;

  // Ambil kunci yang numerik untuk data laporan (hindari "nama_pembimbing")
  const laporanKeys = Object.keys(laporan).filter((key) => !isNaN(key));

  return (
    <div className="p-4">
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 w-full print:hidden bg-blue text-white rounded-lg"
      >
        Cetak Jurnal
      </button>

      <div ref={componentRef} className="border print:border-none p-6 bg-white">
        <div className="flex flex-col items-center text-base font-bold text-center mb-8">
          <h1>JURNAL KEGIATAN MINGGUAN</h1>
          <p>PRAKTIK KERJA LAPANGAN (PKL)</p>
        </div>

        {/* Data Peserta */}
        <div className="space-y-2 mb-6">
          {[
            { label: "Nama Peserta Didik", value: user?.name || "-" },
            {
              label: "Dunia Kerja Tempat PKL",
              value: user?.Pkl?.[0]?.name || "-",
            },
            {
              label: "Nama Instruktur",
              value: laporan?.[laporanKeys[0]]?.nama_instruktur || "-",
            },
            {
              label: "Nama Guru Pembimbing",
              value: laporan?.nama_pembimbing || "-",
            },
          ].map((item, index) => (
            <div key={index} className="flex justify-between gap-4 text-sm">
              <p className="font-semibold w-52">{item.label}</p>
              <p className="font-semibold">:</p>
              <p className="flex-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Tabel Pelaksanaan Kegiatan */}
        <div className="mt-8  overflow-auto">
          <table className="w-full overflow-auto border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-2 w-10">No</th>
                <th className="border border-black p-2 w-10">Minggu</th>
                <th className="border border-black p-2">Pekerjaan</th>
                <th className="border border-black p-2">Catatan</th>
                <th className="border border-black p-2 w-20">
                  Paraf Instruktur
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {laporanKeys.map((key, index) => {
                const data = laporan[key];
                return (
                  <tr key={data.id}>
                    <td className="border border-black p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-black p-2 text-center">
                      Ke- {index + 1}
                    </td>
                    <td className="border border-black p-2">
                      {data.nama_pekerjaan || "-"}
                    </td>
                    <td
                      className="border border-black p-2 text-start"
                      dangerouslySetInnerHTML={{ __html: data.catatan || "-" }}
                    ></td>
                    <td className="border border-black p-2 text-center">-</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan Instruktur */}
        <div className="flex justify-end mt-12 mr-10">
          <div className="text-center">
            <p>Instruktur</p>
            <p className="font-semibold mt-24">
              ( {laporan?.[laporanKeys[0]]?.nama_instruktur || "............"} )
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CetakLaporanRekap;
