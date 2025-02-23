import React, { useEffect, useRef, useState } from "react";
import { getSingleLaporanMingguan } from "../../../../Api/Services/LaporanServices";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { useParams } from "react-router-dom";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import { useReactToPrint } from "react-to-print";
import Loading from "../../../Loading";
import ContainerGlobal from "../../../ContainerGlobal";
import { formatDate, getDayName } from "./CetakLaporanHarian";
import { div } from "framer-motion/m";
import NotfoundData from "../../../NotfoundData";

const CetakLaporanMingguan = () => {
  const { id, week } = useParams();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef(null);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const response = await getSingleLaporanMingguan(id);
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
    documentTitle: "Laporan PKL Mingguan",
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

  return (
    <div className="p-4">
      {/* Pastikan ref digunakan dengan benar */}
      <div>
        <button
          onClick={handlePrint}
          className="mb-4 px-4 py-2 w-full print:hidden bg-blue text-white rounded-lg"
        >
          Cetak Laporan
        </button>
        <div
          ref={componentRef}
          className="border print:border-none p-6  bg-white"
        >
          <div className="flex flex-col items-center text-base font-bold text-center mb-8">
            <h1 className="">JURNAL KEGIATAN MINGGUAN</h1>
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
                value: laporan?.nama_instruktur || "-",
              },
              {
                label: "Nama Guru Pembimbing",
                value: laporan?.nama_pembimbing || "-",
              },
              {
                label: "Minggu Ke-",
                value: week || "-",
              },
            ].map((item, index) => (
              <div key={index} className="flex justify-between gap-4 text-sm">
                <p className="font-semibold w-52">{item.label}</p>
                <p className="font-semibold">:</p>
                <p className="flex-1">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8  overflow-auto">
            <table className="w-full overflow-auto border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black p-2 w-10">No</th>
                  <th className="border border-black p-2">Pekerjaan</th>
                  <th className="border border-black p-2">Catatan</th>
                  <th className="border border-black p-2 w-20">
                    Paraf Instruktur
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                <tr>
                  <td className="border border-black p-2 text-center">1</td>
                  <td className="border border-black p-2">
                    {laporan?.nama_pekerjaan || "-"}
                  </td>
                  <td className="border border-black p-2">
                    {laporan?.catatan || "-"}
                  </td>
                  <td className="border border-black p-2 text-center">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-12 mr-10">
            <div className="text-center">
              <p>Instruktur</p>
              <p className="font-semibold mt-24">
                ( {laporan?.nama_instruktur || "............"} )
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CetakLaporanMingguan;
