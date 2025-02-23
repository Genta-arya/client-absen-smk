import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleLaporan } from "../../../../Api/Services/LaporanServices";
import { useReactToPrint } from "react-to-print";
import Loading from "../../../Loading";
import ContainerGlobal from "../../../ContainerGlobal";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";

// Fungsi untuk mendapatkan nama hari dalam bahasa Indonesia
export const getDayName = (dateString) => {
  const options = { weekday: "long" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

// Fungsi untuk format tanggal ke dd/mm/yyyy
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID");
};

const CetakLaporanHarian = () => {
  const { id } = useParams();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef(null);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const response = await getSingleLaporan(id);
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
    documentTitle: "Laporan PKL Harian",
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
            <h1 className="text-xl font-bold text-center mb-8">
              RINCIAN KEGIATAN PKL HARIAN
            </h1>

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
                { label: "Hari", value: getDayName(laporan?.tanggal) || "-" },
                {
                  label: "Tanggal",
                  value: formatDate(laporan?.tanggal) || "-",
                },
              ].map((item, index) => (
                <div key={index} className="flex justify-between gap-4 text-sm">
                  <p className="font-semibold w-52">{item.label}</p>
                  <p className="font-semibold">:</p>
                  <p className="flex-1">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Pelaksanaan Kegiatan */}
            <div className="space-y-4">
              {[
                {
                  title: "A. Nama Pekerjaan",
                  value: laporan?.nama_pekerjaan || "-",
                },
                {
                  title: "B. Perencanaan Kegiatan",
                  value: laporan?.perencanaan_kegiatan || "-",
                },
                {
                  title: "C. Pelaksanaan Kegiatan/hasil",
                  value: laporan?.pelaksanaan_kegiatan || "-",
                },
                {
                  title: "D. Catatan Instruktur",
                  value: laporan?.catatan_instruktur || "-",
                },
              ].map((item, index) => (
                <div className="mt-12" key={index}>
                  <h2 className="font-bold text-sm">{item.title}</h2>
                  <input
                    type="text"
                    value={item.value}
                    disabled
                    className="w-full disabled:bg-white border p-2 rounded-md bg-gray-100 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-12 mr-10">
              <div className="text-center">
                <p>Instruktur</p>
                <p className="font-semibold mt-12">
                  ( {laporan?.nama_instruktur || "............"} )
                </p>
              </div>
            </div>
          </div>
        </div>
 
    </div>
  );
};

export default CetakLaporanHarian;
