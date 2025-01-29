import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContainerGlobal from "../../../ContainerGlobal";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import { getSingleAbsen } from "../../../../Api/Services/AbsensiServices";
import Loading from "../../../Loading";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { toast } from "sonner";
import { FaClock, FaImage, FaTag } from "react-icons/fa";
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
    // Ambil waktu hari ini
    const tanggalHariIni = new Date();
    const hariIni = new Date(
      tanggalHariIni.getFullYear(),
      tanggalHariIni.getMonth(),
      tanggalHariIni.getDate()
    ); // Hanya tanggal tanpa waktu (jam, menit, detik diset menjadi 00)

    if (!datang) {
      // Jika datang null, return "Tidak Hadir"
      return "Tidak Hadir";
    }

    const date = new Date(datang); // Mengubah datang ke objek Date


    // Set batas waktu jam masuk + 2 jam
    const batasJamPlus2 = new Date(jamMasuk); // jamMasuk adalah waktu yang sudah ada sebelumnya
    batasJamPlus2.setHours(batasJamPlus2.getHours() + 2); // Jam batas 2 jam setelah jam masuk
    batasJamPlus2.setMinutes(0); // Set menit menjadi 0 untuk menghindari lebih dari jam batas

    // Cek apakah datang sebelum tanggal hari ini
    if (date < hariIni) {
      return "Belum Hadir"; // Jika datang sebelum hari ini
    }

    // Cek apakah datang sebelum atau tepat jam batas
    if (date <= batasJamPlus2) {
      return "Hadir"; // Hadir jika datang dalam rentang waktu
    } else {
      return "Telat Hadir"; // Telat jika lebih dari jam batas
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
                            {data.pulang ? formatWaktu24Jam(data.pulang) : "-"}
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
