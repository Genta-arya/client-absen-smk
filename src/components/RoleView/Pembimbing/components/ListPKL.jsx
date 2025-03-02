import React, { useEffect, useState } from "react";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { getPKLCreator } from "../../../../Api/Services/PKLServices";
import Loading from "../../../Loading";
import { formatTanggal } from "../../../../constants/Constants";
import { FaCircle, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ListPKL = ({ searchTerm }) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getPKLCreator(user.id);
      setData(response.data);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
      }
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterDataName = (data, searchTerm) => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="mt-4">
      {filterDataName(data, searchTerm).length === 0 ? (
        <p className="text-center text-gray-500 mt-12 ">
          Belum memiliki tempat pkl.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
          {filterDataName(data, searchTerm).map((item) => (
            <div key={item.id} className="bg-white p-4 border border-dashed">
              <div className="flex items-center gap-2">
                <FaTag className="text-blue" />
                <h2 className="lg:text-xl md:text-xl text-base font-semibold text-blue">
                  {item.name}
                </h2>
              </div>
              <p className="text-gray-700 border border-dashed px-4 py-1">
                {item.alamat}
              </p>
              <div className="text-xs border-b p-1">
                <div className="py-1">
                  <h1 className="text-center font-bold text-base">Periode</h1>
                  <h1 className="text-center font-bold text-sm">
                    Praktik Kerja Lapangan
                  </h1>
                </div>
                <div className="flex gap-2 items-center justify-center">
                  <p className="text-gray-700 text-xs">
                    <strong></strong> {formatTanggal(item.tanggal_mulai)}
                  </p>
                  <p>-</p>
                  <p className="text-gray-700">
                    <strong></strong> {formatTanggal(item.tanggal_selesai)}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Dibuat: {formatTanggal(item.createdAt)}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  {item.status === true ? (
                    <div className="flex items-center gap-1">
                      <FaCircle className="text-green-500" />
                      <p className="text-green-500">Aktif</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <FaCircle className="text-red-500" />
                      <p className="text-red-500">Selesai</p>
                    </div>
                  )}
                </div>
                <div
                  onClick={() =>
                    navigate(`/admin/management/pkl/detail/${item.id}`)
                  }
                  className="flex hover:opacity-85 cursor-pointer transition-all duration-300  items-center justify-center gap-2 bg-blue text-white px-4 py-2 rounded-md"
                >
                  <button className="">Detail </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListPKL;
