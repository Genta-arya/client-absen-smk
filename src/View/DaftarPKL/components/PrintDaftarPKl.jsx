import React, { forwardRef } from "react";
import { useReactToPrint } from "react-to-print";
import { DateTime } from "luxon";

const PrintDaftarPKL = forwardRef(({ data }, ref) => {
  const handlePrint = useReactToPrint({
    documentTitle: "Daftar PKL",
    content: () => ref.current,
    pageStyle: `
         
          body {
            margin: 20mm; /* Atur margin konten di dalam body */
          }
        
        `,
  });

  // Urutkan data berdasarkan Nama PKL (A-Z)
  const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <button
        onClick={handlePrint}
        disabled={sortedData.length === 0}
        className="p-1 bg-blue disabled:cursor-not-allowed disabled:bg-gray-500 w-full text-white rounded mb-4"
      >
        Cetak Daftar PKL
      </button>
      <div ref={ref} className="mt-4 p-4 ">
        <h2 className="text-xl font-bold text-center mb-4">Daftar PKL SMKN 2 KETAPANG</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-500 p-1">No</th>
              <th className="border border-gray-500 p-1">Nama PKL</th>
              <th className="border border-gray-500 p-1">Alamat</th>
              <th className="border border-gray-500 p-1">Pembimbing</th>
              <th className="border border-gray-500 p-1">Periode</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={item.id} className="text-center">
                <td className="border border-gray-500 p-1">{index + 1}</td>
                <td className="border border-gray-500 p-1 ">{item.name}</td>
                <td className="border border-gray-500 p-1 text-left">{item.alamat}</td>
                <td className="border border-gray-500 p-1">
                  {item.creator?.name || "Tidak ada"}
                </td>
                <td className="border border-gray-500 p-1">
                  {DateTime.fromISO(item.tanggal_mulai).toFormat("dd LLL yyyy")}{" "}
                  -{" "}
                  {DateTime.fromISO(item.tanggal_selesai).toFormat(
                    "dd LLL yyyy"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default PrintDaftarPKL;
