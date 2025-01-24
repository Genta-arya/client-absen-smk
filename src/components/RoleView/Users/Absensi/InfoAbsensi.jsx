import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContainerGlobal from "../../../ContainerGlobal";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import { getSingleAbsen } from "../../../../Api/Services/AbsensiServices";
import Loading from "../../../Loading";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { toast } from "sonner";

const InfoAbsensi = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { user } = useAuthStore();
  const [status, setStatus] = useState(false);
  const curentDate = user?.DateIndonesia;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getSingleAbsen(id);
      if (response.data.hadir === null) {
        setStatus(true);
      }
      setData(response.data);
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const formatTanggal = (tanggal) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  const formatWaktu24Jam = (waktu) => {
    const date = new Date(waktu);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const validateDatang = (datang) => {
    const date = new Date(datang);
    const datangJam = date.getHours();
    const datangMenit = date.getMinutes();

    if (
      (datangJam === 7 && datangMenit >= 0) ||
      (datangJam === 8 && datangMenit === 0)
    ) {
      return "Hadir";
    } else {
      return "Telat Hadir";
    }
  };

  const validatePulang = (pulang) => {
    if (!pulang) return "Belum Pulang";

    const date = new Date(pulang);
    const pulangJam = date.getHours();
    const pulangMenit = date.getMinutes();

    if (
      (pulangJam === 16 && pulangMenit >= 0) ||
      (pulangJam === 17 && pulangMenit === 0)
    ) {
      return "Tepat Waktu";
    } else {
      return "Pulang Cepat";
    }
  };

  if (loading) return <Loading />;

  return (
    <ContainerGlobal>
      {status ? (
        <div className="mt-24 flex flex-col gap-4">
          <p className="text-center">
            Pada tanggal {formatTanggal(data.tanggal)}
          </p>
          <h1 className="text-xl font-bold text-gray-800 mb-4 text-center ">
            Data Absensi Tidak Ditemukan
          </h1>
        </div>
      ) : (
        <div className="  ">
          {data ? (
            <>
              <h1 className="text-xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
                Informasi Absensi
              </h1>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-gray-900">
                    {formatTanggal(data.tanggal)}
                  </span>
                </div>

                <div className="flex items-center flex-col">
                  <span className="font-bold text-gray-700 ">
                    Bukti Kehadiran
                  </span>

                  {!data.foto ? (
                    <>
                      <span className="font-medium text-gray-700 ">-</span>
                    </>
                  ) : (
                    <img
                      src={data.foto}
                      onClick={() => window.open(data.foto, "_blank")}
                      alt="Absen"
                      className="w-full lg:w-[50%] md:w-[50%] object-cover rounded cursor-pointer"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-4 ">
                  <div className="flex    flex-col items-center">
                    <span className=" text-gray-700 border-b w-full text-center font-bold mt-8">
                      Lokasi
                    </span>
                    <a
                      href={`https://www.google.com/maps?q=${data.gps}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-4"
                    >
                      <div className="flex flex-col">
                        <span className="text-gray-900">{data.posisi}</span>
                        <span className="text-gray-500">{data.gps}</span>
                      </div>
                    </a>
                  </div>
                  <div className="w-full md:h-96 h-72 mt-2">
                    <iframe
                      src={`https://www.google.com/maps?q=${data.gps}&output=embed&style=feature:all|element:geometry|color:0x212121&style=feature:all|element:labels.icon|visibility:off&style=feature:landscape|element:all|color:0x121212&style=feature:poi|element:all|color:0x121212&style=feature:road|element:geometry|color:0x2f2f2f&style=feature:road|element:labels|visibility:off&style=feature:transit|element:geometry|color:0x2f2f2f&style=feature:water|element:all|color:0x121212`}
                      title="Google Maps Preview"
                      className="w-full h-full border rounded-lg shadow-xl shadow-black"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4 bg-gray-50 p-2 pb-4 rounded-md ">
                  <div className="font-bold border-b w-full text-center pb-2 pt-4 ">
                    Keterangan Hadir
                  </div>
                  <div className="flex gap-4">
                    <div className="flex md:flex-row lg:flex-row flex-col items-center justify-between w-full gap-8">
                      <div className="flex flex-col">
                        <span className="font-medium text-center  text-gray-700 w-full">
                          Datang:
                        </span>
                        <div className="mt-4">
                          <span className="text-gray-900">
                            {formatWaktu24Jam(data.datang)}
                          </span>
                          <span
                            className={`ml-2 px-2 py-1 rounded ${
                              validateDatang(data.datang) === "Hadir"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {validateDatang(data.datang)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center flex-col ">
                        <span className="font-medium text-gray-700 ">
                          Pulang:
                        </span>
                        <div className="mt-4">
                          <span className="text-gray-900 ">
                            {data.pulang ? formatWaktu24Jam(data.pulang) : "-"}
                          </span>
                          <span
                            className={`ml-2 px-2 py-1 rounded ${
                              validatePulang(data.pulang) === "Tepat Waktu"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {validatePulang(data.pulang)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-700 text-center font-bold mt-20">
              Data tidak ditemukan.
            </p>
          )}
        </div>
      )}
    </ContainerGlobal>
  );
};

export default InfoAbsensi;
