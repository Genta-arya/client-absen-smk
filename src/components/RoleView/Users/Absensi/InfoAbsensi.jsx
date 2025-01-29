import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContainerGlobal from "../../../ContainerGlobal";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import { getSingleAbsen } from "../../../../Api/Services/AbsensiServices";
import Loading from "../../../Loading";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { toast } from "sonner";
import {
  FaClock,
  FaImage,
  FaMehRollingEyes,
  FaRegFrown,
  FaTag,
} from "react-icons/fa";
import { FaLocationPin, FaLocationPinLock } from "react-icons/fa6";

const InfoAbsensi = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { user } = useAuthStore();
  const [status, setStatus] = useState(false);
  const mapData = user?.Pkl?.map((item) => item);
  const filterData = mapData?.filter((item) => item.isDelete === false);
  const dataAbsen = filterData?.[0]?.absensi || [];
  const dataShift = dataAbsen[0]?.shift;
  const jamKeluar = dataShift?.jamPulang;
  const jamMasuk = dataShift?.jamMasuk;

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
    if (!datang) {
      return "-"; // Jika datang null, return "-"
    }

    const date = new Date(datang);
    const datangJam = date.getHours();
    const datangMenit = date.getMinutes();

    const jamMasukDate = new Date(jamMasuk);
    const jamMasukJam = jamMasukDate.getHours();
    const jamMasukMenit = jamMasukDate.getMinutes();

    // Batas keterlambatan: 2 jam setelah jamMasuk
    const batasJam = jamMasukJam + 2;
    const batasMenit = jamMasukMenit;

    // Bandingkan hanya jam dan menit
    if (
      datangJam < batasJam ||
      (datangJam === batasJam && datangMenit <= batasMenit)
    ) {
      return "Hadir"; // Hadir jika datang dalam rentang waktu
    } else {
      return "Telat Hadir"; // Telat jika lebih dari batas
    }
  };

  const validatePulang = (pulang) => {
    if (!pulang) return "-";

    const date = new Date(pulang);
    const pulangJam = date.getHours();
    const pulangMenit = date.getMinutes();

    const jamKeluarDate = new Date(jamKeluar);
    const jamKeluarJam = jamKeluarDate.getHours();
    const jamKeluarMenit = jamKeluarDate.getMinutes();

    // Batas pulang lebih cepat: 1 jam sebelum jamKeluar
    const batasJam = jamKeluarJam - 1;
    const batasMenit = jamKeluarMenit;

    // Bandingkan hanya jam dan menit
    if (
      pulangJam > batasJam ||
      (pulangJam === batasJam && pulangMenit >= batasMenit)
    ) {
      return "Pulang";
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
          {/* emot bingung */}
          <FaMehRollingEyes size={100} className="mx-auto text-blue" />
          <h1 className="text-xl font-bold text-gray-800 mb-4 text-center ">
            Data Absensi Tidak Ditemukan
          </h1>
        </div>
      ) : (
        <div className="  ">
          {data ? (
            <>
              {!data?.datang || data?.hadir !== "hadir" ? (
                <div className="mt-24 flex flex-col gap-4">
                  <p className="text-center text-red-500">
                    {formatTanggal(data.tanggal)}
                  </p>
                  <FaRegFrown size={100} className=" mx-auto text-red-500" />
                  <h1 className="text-xl font-bold text-red-500 mb-4 text-center  ">
                    Kamu Tidak hadir pada tanggal ini
                  </h1>
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
                    <div className="flex items-center gap-2">
                      <FaTag />
                      <p>Informasi Absensi</p>
                    </div>
                  </h1>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {formatTanggal(data.tanggal)}
                      </span>
                    </div>

                    <div className="flex w-full flex-col items-center gap-4  p-2 pb-4 rounded-md ">
                      <div className="font-bold border-b w-full text-center pb-2 pt-4 ">
                        <div className="flex items-center justify-center gap-2">
                          <FaClock className="text-blue" />
                          <p>Jam Kehadiran</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex lg:text-base md:text-base text-sm items-center justify-between w-full gap-8">
                          <div className="flex flex-col">
                            <span className="font-medium text-center  text-gray-700 w-full">
                              Masuk
                            </span>
                            <div className="mt-4 flex-col flex items-center">
                              <span className="text-gray-900">
                                {formatWaktu24Jam(data.datang)}
                              </span>
                              <span
                                className={` text-xs px-2 py-1 rounded ${
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
                              Keluar
                            </span>
                            <div className="mt-4 flex-col flex items-center">
                              <span className="text-gray-900 ">
                                {data.pulang
                                  ? formatWaktu24Jam(data.pulang)
                                  : "-"}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
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

                    <div className="flex items-center flex-col">
                      <span className="font-bold text-gray-700 ">
                        <div className="flex items-center gap-2">
                          <FaImage />
                          <p>Bukti Kehadiran</p>
                        </div>
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
                          <div className="flex items-center justify-center gap-2">
                            <FaLocationPinLock className="text-red-500" />
                            <p>Lokasi</p>
                          </div>
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
                      <div className="flex flex-col items-center ">
                        <div className="w-screen h-screen  mt-2">
                          <iframe
                            src={`https://www.google.com/maps?q=${data.gps}&output=embed&style=feature:all|element:geometry|color:0x212121&style=feature:all|element:labels.icon|visibility:off&style=feature:landscape|element:all|color:0x121212&style=feature:poi|element:all|color:0x121212&style=feature:road|element:geometry|color:0x2f2f2f&style=feature:road|element:labels|visibility:off&style=feature:transit|element:geometry|color:0x2f2f2f&style=feature:water|element:all|color:0x121212`}
                            title="Google Maps Preview"
                            className="w-full h-full border"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
