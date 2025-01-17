import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSinglePkl } from "../../../../Api/Services/PKLServices";
import Loading from "../../../Loading";
import ContainerGlobal from "../../../ContainerGlobal";

const DetailPkl = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [newUser, setNewUser] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getSinglePkl(id);
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      alert("PKL berhasil dihapus.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = async () => {
    try {
      fetchData();
      setNewUser("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (!data) return <p>Data tidak ditemukan.</p>;

  return (
    <ContainerGlobal>
      <div className="">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Detail PKL</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Informasi PKL
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>Nama:</strong> {data.name}
            </p>
            <p className="text-gray-700">
              <strong>Alamat:</strong> {data.alamat}
            </p>
            <p className="text-gray-700">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded ${
                  data.status
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {data.status ? "Aktif" : "Tidak Aktif"}
              </span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Daftar Siswa PKL
          </h2>
          <ul className="space-y-4">
            {data.users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded shadow"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium">
                      {user.name}
                    </span>
                    <span className="text-gray-500 text-xs">NISN: {user.nim}</span>
                  </div>
                </div>
                <div className="text-xs cursor-pointer hover:underline">
                    Lihat Detail
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600 transition"
        >
          Hapus PKL
        </button>
      </div>
    </ContainerGlobal>
  );
};

export default DetailPkl;
