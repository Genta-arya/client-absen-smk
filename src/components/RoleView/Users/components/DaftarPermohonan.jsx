import React from "react";
import Table from "../../../Table/Table";
import Thead from "../../../Table/Thead";
import Tbody from "../../../Table/Tbody";
import { formatDate } from "../../../../constants/Constants";

// Data Dummy
const dummyData = [
  { id: 1, nama: "John Doe", status: "Diproses", tanggal: "2025-01-01" },
  { id: 2, nama: "Jane Smith", status: "Selesai", tanggal: "2025-01-05" },
  { id: 3, nama: "Muhammad Ali", status: "Selesai", tanggal: "2025-01-07" },
  { id: 4, nama: "Diana Ross", status: "Diproses", tanggal: "2025-01-09" },

];

const DaftarPermohonan = () => {
  const filterDataStatus = (status) => {
    return dummyData.filter((data) => data.status === "Selesai");
  };
  return (
    <div className="mt-8 pb-12">
      <p className="text-base font-bold">Permohonan Disetujui</p>
      <div className="-mt-4">
        <Table>
          <Thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr>
          </Thead>

          <Tbody>
            {filterDataStatus().map((data, index) => (
              <tr key={data.id}>
                <td>{index + 1}</td>
                <td>{data.nama}</td>
                <td>{data.status}</td>
                <td>{formatDate(data.tanggal)}</td>
              </tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};

export default DaftarPermohonan;
