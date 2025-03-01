import React, { useEffect, useState } from "react";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import ContainerGlobal from "../../../ContainerGlobal";
import { formatTanggal } from "../../../../constants/Constants";
import { FaCircle, FaTag, FaUser, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotfoundData from "../../../NotfoundData";
import { getAnggotaPkl } from "../../../../Api/Services/PKLServices";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import Loading from "../../../Loading";
import { formatJam } from "../../../../View/DaftarPKL/components/ListPKL";
const formatJamMenit = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const MainAbsensi = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const mapData = user?.Pkl?.map((item) => item);
  const filterData = mapData?.filter((item) => item.isDelete === false);

  const fetchAnggota = async () => {
    setLoading(true);
    try {
      const response = await getAnggotaPkl(filterData[0].id);
      setData(response.data.users);
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterData?.length === 0) {
      return;
    }
    fetchAnggota();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <ContainerGlobal title={"Daftar PKL"}>
      <div className="my-6">
        {filterData?.length === 0 ? (
          <NotfoundData />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
            {filterData.map((item) => (
              <div key={item.id} className="bg-white p-4 border border-dashed">
                <div className="flex items-center gap-2">
                  <FaTag className="text-blue-500" />
                  <h2 className="lg:text-xl md:text-xl text-base font-semibold text-blue-500">
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

                <div>
                  <h1 className="mt-2 text-sm font-bold">Pembimbing</h1>
                  <div className="flex items-center gap-2">
                    <img
                      src={item.creator?.avatar}
                      alt=""
                      onClick={() => window.open(item.creator?.avatar)}
                      className="w-10 rounded-sm cursor-pointer hover:opacity-80"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-bold text-sm">
                        {item.creator?.name}
                      </h1>
                      <h1 className="text-xs">{item.creator?.nim}</h1>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Dibuat: {formatTanggal(item.createdAt)}
                  </p>
                </div>

                <div className="mt-4 text-xs flex justify-between items-center">
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
                  <div>
                    <h2 className="text-xs font-semibold text-blue-500">
                      {item.link_grup ? (
                        <a
                          href={item.link_grup}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2 text-xs">
                            <FaWhatsapp className="text-green-500" size={20} />
                            <h2 className="font-semibold text-blue-500">
                              Grup
                            </h2>
                          </div>
                        </a>
                      ) : null}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
            <div>
              {data?.length === 0 ? null : (
                <>
                  <div className="flex items-center gap-2 mt-4 text-lg font-bold mb-8 text-blue">
                    <FaUser size={25} />
                    <p>Anggota PKL</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {data?.map((anggota) => (
                      <div
                        key={anggota.id}
                        className="bg-white p-4 border border-dashed"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <img
                            src={anggota.avatar}
                            alt=""
                            onClick={() => window.open(anggota.avatar)}
                            className="w-10 rounded-full cursor-pointer hover:opacity-80"
                          />
                          <div>
                            <h2 className="text-sm font-semibold text-blue-500">
                              {anggota.name}
                            </h2>

                            <h2 className=" text-xs font-semibold text-blue-500">
                              {anggota.Kelas?.map((kelas) => kelas.nama)}
                            </h2>

                            <div className="text-xs">
                              <p>{anggota?.Absensi[0]?.shift?.name || "-"}</p>
                              <div className="flex items-center gap-1">

                              <p>
                                {formatJam(
                                  anggota?.Absensi[0]?.shift?.jamMasuk
                                ) || "-"}
                              </p>
                              <p>-</p>
                              <p>
                                {formatJam(
                                  anggota?.Absensi[0]?.shift?.jamPulang
                                ) || "-"}
                              </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-4">
                          <h2 className="text-xs font-semibold text-blue-500">
                            {anggota.noHp ? (
                              <a
                                href={`https://wa.me/${anggota.noHp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <FaWhatsapp
                                  className="text-green-500"
                                  size={20}
                                />
                              </a>
                            ) : (
                              <span className="text-gray-400">
                                No HP tidak tersedia
                              </span>
                            )}
                          </h2>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ContainerGlobal>
  );
};

export default MainAbsensi;
