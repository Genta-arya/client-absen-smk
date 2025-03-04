import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContainerGlobal from "../../../ContainerGlobal";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import {
  getSingleAbsen,
  updateStatus,
} from "../../../../Api/Services/AbsensiServices";
import Loading from "../../../Loading";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { toast } from "sonner";
import {
  FaClock,
  FaHeartbeat,
  FaImage,
  FaMehRollingEyes,
  FaRegFrown,
  FaTag,
  FaUserInjured,
} from "react-icons/fa";
import {
  FaLocationPin,
  FaLocationPinLock,
  FaPencil,
  FaUmbrellaBeach,
} from "react-icons/fa6";
import { DateTime } from "luxon";
import ActModal from "../../../Modal/ActModal";
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
  const [openModal, setOpenModal] = useState(false);
  const [statusAbsensi, setStatusAbsensi] = useState("");
  const [tempStatus, setTempStatus] = useState(statusAbsensi);
  const today = DateTime.fromISO(user?.DateIndonesia).startOf("day");
  const targetDate = DateTime.fromISO(data?.tanggal).startOf("day");


  const isPastDate = targetDate > today;

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
    if (data?.hadir !== undefined) {
      setTempStatus(data.hadir);
      setStatusAbsensi(data.hadir);
    }
  }, [data]);

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
    if (!datang) return "-";

    // Pastikan waktu datang diparse dengan benar
    const datangDate = DateTime.fromISO(datang).setZone("Asia/Jakarta");
    const jamMasukDate = DateTime.fromISO(jamMasuk).setZone("Asia/Jakarta");

    // Periksa apakah parsing berhasil
    if (!datangDate.isValid || !jamMasukDate.isValid) {
      return "-";
    }

    // Ambil jam dan menit saja (abaikan tanggal)
    const datangJamMenit = datangDate.toFormat("HH:mm");
    const jamMasukJamMenit = jamMasukDate.toFormat("HH:mm");

    // Batas keterlambatan: 2 jam setelah jam masuk
    const batasKeterlambatan = jamMasukDate.plus({ minutes: 15 });
    const batasKeterlambatanJamMenit = batasKeterlambatan.toFormat("HH:mm");

    // Bandingkan hanya jam dan menit
    if (datangJamMenit <= batasKeterlambatanJamMenit) {
      return "Hadir"; // Jika datang sebelum atau tepat batas
    } else {
      return "Telat Hadir"; // Jika datang setelah batas
    }
  };

  // Validasi Waktu Pulang
  const validatePulang = (pulang) => {
    if (!pulang) return "-";

    // Pastikan waktu pulang diparse dengan benar
    const pulangDate = DateTime.fromISO(pulang).setZone("Asia/Jakarta");
    const jamKeluarDate = DateTime.fromISO(jamKeluar).setZone("Asia/Jakarta");

    // Periksa apakah parsing berhasil
    if (!pulangDate.isValid || !jamKeluarDate.isValid) {
      return "-";
    }

    // Ambil jam dan menit saja (abaikan tanggal)
    const pulangJamMenit = pulangDate.toFormat("HH:mm");

    // Batas pulang cepat: 1 jam sebelum jam keluar
    const batasPulangCepat = jamKeluarDate.minus({ hours: 1 });
    const batasPulangCepatJamMenit = batasPulangCepat.toFormat("HH:mm");

    // Bandingkan hanya jam dan menit
    if (pulangJamMenit >= batasPulangCepatJamMenit) {
      return "Pulang"; // Jika pulang sesuai atau lebih lambat dari batas
    } else {
      return "Pulang Cepat"; // Jika pulang lebih cepat dari batas
    }
  };

  const handleSaveStatus = async () => {
    if (tempStatus.length === 0) {
      return toast.info("Pilih status terlebih dahulu.");
    }
    setLoading(true);
    try {
      await updateStatus(id, tempStatus);

      toast.success("Status absensi berhasil diperbarui.");
      window.location.reload();
      setOpenModal(false);
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <ContainerGlobal>
      {statusAbsensi === "izin" && (
        <div className="mt-24 flex flex-col gap-4">
          <p className="text-center">
            Pada tanggal {formatTanggal(data.tanggal)}
          </p>
          {/* emot bingung */}
          <FaHeartbeat size={100} className="mx-auto text-blue" />

          <p className="text-center text-2xl font-bold text-blue">
            Sedang Izin Kegiatan
          </p>

          {!openModal && (
            <>
              {user?.role !== "user" && (
                <div className="flex text-xs justify-center">
                  <div
                    onClick={() => setOpenModal(true)}
                    className=" hover:opacity-75  cursor-pointer border-gray-400 flex justify-center gap-2 items-center border w-fit px-3 py-1 rounded-md"
                  >
                    <FaPencil />
                    <button>
                      <p>Edit Status Absensi</p>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {statusAbsensi === "libur" && (
        <div className="mt-24 flex flex-col gap-4">
          <p className="text-center">
            Pada tanggal {formatTanggal(data.tanggal)}
          </p>
          {/* emot bingung */}
          <FaUmbrellaBeach size={100} className="mx-auto text-green-500" />
          <p className="text-center text-2xl font-bold text-green-500">
            Hari Libur
          </p>

          {!openModal && (
            <>
              {user?.role !== "user" && (
                <div className="flex text-xs justify-center">
                  <div
                    onClick={() => setOpenModal(true)}
                    className=" hover:opacity-75  cursor-pointer border-gray-400 flex justify-center gap-2 items-center border w-fit px-3 py-1 rounded-md"
                  >
                    <FaPencil />
                    <button>
                      <p>Edit Status Absensi</p>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {statusAbsensi === null && (
        <div className="mt-24 flex flex-col gap-4">
          <p className="text-center">
            Pada tanggal {formatTanggal(data.tanggal)}
          </p>
          {/* emot bingung */}
          <FaMehRollingEyes size={100} className="mx-auto text-blue" />
          <h1 className="text-xl font-bold text-gray-800 mb-4 text-center ">
            Data Absensi Tidak Ditemukan
          </h1>
          {!openModal && (
            <>
              {user?.role !== "user" && (
                <div className="flex text-xs justify-center">
                  <div
                    onClick={() => setOpenModal(true)}
                    className=" hover:opacity-75  cursor-pointer border-gray-400 flex justify-center gap-2 items-center border w-fit px-3 py-1 rounded-md"
                  >
                    <FaPencil />
                    <button>
                      <p>Edit Status Absensi</p>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {statusAbsensi === "tidak_hadir" && (
        <div className="  ">
          <>
            <div className="mt-24 flex flex-col gap-4">
              <p className="text-center text-red-500">
                {formatTanggal(data.tanggal)}
              </p>
              <FaRegFrown size={100} className=" mx-auto text-red-500" />
              <h1 className="text-xl font-bold text-red-500 mb-4 text-center  ">
                Kamu Tidak hadir pada tanggal ini
              </h1>

              {!openModal && (
                <>
                  {user?.role !== "user" && (
                    <div className="flex text-xs justify-center">
                      <div
                        onClick={() => setOpenModal(true)}
                        className=" hover:opacity-75  cursor-pointer border-gray-400 flex justify-center gap-2 items-center border w-fit px-3 py-1 rounded-md"
                      >
                        <FaPencil />
                        <button>
                          <p>Edit Status Absensi</p>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        </div>
      )}
      {statusAbsensi === "hadir" ||
        (statusAbsensi === "selesai" && (
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

              {!openModal && (
                <>
                  {user?.role !== "user" && (
                    <div className="flex text-xs justify-center">
                      <div
                        onClick={() => setOpenModal(true)}
                        className=" hover:opacity-75  cursor-pointer border-gray-400 flex justify-center gap-2 items-center border w-fit px-3 py-1 rounded-md"
                      >
                        <FaPencil />
                        <button>
                          <p>Edit Status Absensi</p>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

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
                        <span className="text-white bg-green-400 px-3 w-28 text-center  rounded ">
                          {formatWaktu24Jam(data.datang)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center flex-col ">
                      <span className="font-medium text-gray-700 ">Keluar</span>
                      <div className="mt-4 flex-col flex items-center">
                        <span className="text-white bg-red-400 px-3 w-28 text-center  rounded ">
                          {data.pulang ? formatWaktu24Jam(data.pulang) : "-"}
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
                      className="w-full h-screen border"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      {openModal && (
        <ActModal
          isModalOpen={openModal}
          setIsModalOpen={setOpenModal}
          title="Edit Status Absensi"
        >
          <div className="text-xs flex flex-col space-y-4">
            <select
              className="border rounded-lg p-2 focus:ring focus:ring-blue-300"
              value={tempStatus} // Gunakan state sementara
              onChange={(e) => setTempStatus(e.target.value)}
            >
              {!isPastDate && <option value="selesai">Hadir</option>}
              {!isPastDate && <option value="tidak_hadir">Tidak Hadir</option>}

              <option value="izin">Izin</option>
              <option value="libur">Libur</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setOpenModal(false)}
              >
                Batal
              </button>
              <button
                disabled={loading}
                onClick={handleSaveStatus}
                className="bg-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </ActModal>
      )}
    </ContainerGlobal>
  );
};

export default InfoAbsensi;
