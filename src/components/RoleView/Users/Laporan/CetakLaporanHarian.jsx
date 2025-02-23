import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleLaporan } from "../../../../Api/Services/LaporanServices";
import { useReactToPrint } from "react-to-print";
import Loading from "../../../Loading";
import ContainerGlobal from "../../../ContainerGlobal";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import NotfoundData from "../../../NotfoundData";

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
          <div className="space-y-3">
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
            ].map((item, index) => (
              <div className="mt-5" key={index}>
                <h2 className="font-bold text-sm">{item.title}</h2>
                <p className="mt-2 border border-gray-400 p-2 rounded-md text-xs">
                  {item.value}
                </p>
              </div>
            ))}

            {laporan.fotos?.length > 0 && (
              <>
                <h2 className="font-bold text-sm mb-2 ">
                  D. Gambar Kegiatan
                </h2>
                <div className="border border-gray-400 p-2 rounded-md">
                  <div className="grid grid-cols-3 gap-2">
                    {laporan.fotos.map((foto, index) => (
                      <div key={index} className=" p-2 rounded-md ">
                        <div className="flex justify-center">
                          <img
                            src={foto.foto_url}
                            alt={`Bukti ${index + 1}`}
                            className="w-14 rounded-md"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="mt-3">
              <h2 className="font-bold text-sm">E. Catatan Instruktur</h2>
              <p className="mt-2 border border-gray-400 p-2 rounded-md text-xs ">
                {laporan?.catatan_instruktur || "-"}
              </p>
            </div>

            <div className="flex justify-end mt-12 mr-10">
              <div className="text-center">
                <p>Instruktur</p>
                <p className="font-semibold mt-16">
                  ( {laporan?.nama_instruktur || "............"} )
                </p>
              </div>
            </div>
            {/* Bukti Laporan Kegiatan */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CetakLaporanHarian;
