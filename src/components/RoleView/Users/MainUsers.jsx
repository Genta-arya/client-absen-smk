import React, { useEffect, useState } from "react";
import Select from "react-select";
import Tools from "../../Tools";

import ButtonNav from "../../ButtonNav";
import ContentUser from "./components/ContentUser";
import useAuthStore from "../../../Lib/Zustand/AuthStore";
import ActModal from "../../Modal/ActModal";
import Input from "../../Input";
import LoadingButton from "../../LoadingButton";
import {
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaRegCalendar,
  FaSave,
  FaSignInAlt,
  FaSignOutAlt,
  FaTimesCircle,
  FaWifi,
} from "react-icons/fa";
import { updateDataUser, getKelas } from "../../../Api/Services/LoginServices";
import { ResponseHandler } from "../../../Utils/ResponseHandler";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { API_URL, formatTanggal, SOCKET } from "../../../constants/Constants";

import { useNavigate } from "react-router-dom";
import useLocationStore from "../../../Lib/Zustand/useLocationStore";
import { BeatLoader } from "react-spinners";
import UseLogout from "../../../Lib/Hook/UseLogout";
import ModalAbsens from "./Absensi/ModalAbsens";
import { FaC, FaMapLocation } from "react-icons/fa6";
import { handlePulangs } from "../../../Api/Services/AbsensiServices";
import { DateTime } from "luxon";
import Lottie from "lottie-react";
import animation from "../../../assets/succes.json";
const MainUsers = () => {
  const { user } = useAuthStore();
  const mapData = user?.Pkl?.map((item) => item);
  const filterData = mapData?.filter((item) => item.isDelete === false);
  const dataAbsen = filterData?.[0]?.absensi || [];
  const role = user?.role;
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [modalMaps, setModalMaps] = useState(false);
  const [next, setNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [kelasOptions, setKelasOptions] = useState([]); // Options for React Select
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [iplocal, setIplocal] = useState(null);
  const [ping, setPing] = useState(30);
  const [data, setData] = useState({
    name: user?.name,
    nim: user?.nim,
    email: user?.email,
    kelas: user?.kelas,
  });
  const currentDate = user?.DateIndonesia
    ? new Date(user?.DateIndonesia)
    : null;

  const dataShift = dataAbsen[0]?.shift;
  const nameShift = dataShift?.name;
  const jamKeluar = dataShift?.jamPulang;
  const jamMasuk = dataShift?.jamMasuk;
  const date = new Date(jamMasuk); // Hanya panggil sekali
  const jamMasukHours = date.getHours().toString().padStart(2, "0");
  const jamMasukMinutes = date.getMinutes().toString().padStart(2, "0");

  // Fungsi untuk mengonversi ke UTC dari zona waktu Indonesia (UTC+7)
  const convertToUTC = (date) => {
    if (!date) return null;
    const utcDate = new Date(date.getTime() + 7 * 60 * 60 * 1000); // Kurangi 7 jam (UTC+7)
    return utcDate.toISOString().split("T")[0];
  };

  const formattedCurrentDate = convertToUTC(currentDate);

  // Ambil data absen yang tanggalnya sama dengan tanggal hari ini
  const dataAbsenToday = dataAbsen.filter(
    (item) =>
      new Date(item.tanggal).toISOString().split("T")[0] ===
      formattedCurrentDate
  );
  const absenToday = dataAbsenToday[0] || null;

  const navigate = useNavigate();
  const { location, locationError } = useLocationStore();
  const { logout, loading: loadingLogout } = UseLogout();
  const fetchKelas = async () => {
    setLoading1(true);
    try {
      const response = await getKelas();
      const options = response.data.map((kelas) => ({
        value: kelas.id,
        label: kelas.nama,
      }));
      setKelasOptions(options);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
      }
      ResponseHandler(error.response);
    } finally {
      setLoading1(false);
    }
  };

  useEffect(() => {
    if (user?.email === null || user?.Kelas?.length === 0) {
      setModal(true);
    }
  }, [user]);

  useEffect(() => {
    fetchKelas();
  }, []);

  const updateData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user?.Kelas?.length === 0) {
        await updateDataUser({
          id: user?.id,
          name: user?.name,
          nim: user?.nim,
          email: data.email,
          kelas: selectedKelas?.value,
        });
      } else {
        await updateDataUser({
          id: user?.id,
          name: user?.name,
          nim: user?.nim,
          email: data.email,
          kelas: user?.Kelas[0]?.id,
        });
      }

      toast.success("Data berhasil diperbarui");

      window.location.reload();
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
      }
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };
  const toUTC7 = (inputDate) => {
    return new Date(inputDate.getTime() - 7 * 60 * 60 * 1000); // Konversi ke UTC+7
  };
  // const serverDate = toUTC7(new Date(user?.DateIndonesia));
  const serverDate = DateTime.fromISO(user?.DateIndonesia);

  const isMasukDisabled = () => {
    if (!dataShift || !jamKeluar || !jamMasuk) {
      return true; // Nonaktifkan jika data shift tidak tersedia
    }

    const jamMasuks = DateTime.fromISO(jamMasuk); // Menggunakan Luxon untuk jamMasuk
    const jamTutup = jamMasuks.plus({ minutes: 15 }); // Hanya aktif selama 15 menit setelah jamMasuk

    const serverTime = serverDate.toMillis(); // Waktu server dalam milidetik
    const masukTime = jamMasuks.toMillis(); // Waktu masuk dalam milidetik
    const tutupTime = jamTutup.toMillis(); // Waktu tutup dalam milidetik

    return !(serverTime >= masukTime && serverTime <= tutupTime);
  };

  const isPulangDisabled = () => {
    if (!dataShift || !jamKeluar || !jamMasuk) {
      return true; // Nonaktifkan jika data shift tidak tersedia
    }

    const serverTimeMillis = serverDate.toMillis(); // Waktu server dalam milidetik

    // Pastikan jamKeluars memiliki tanggal yang sama dengan serverDate
    const jamKeluars = serverDate.set({
      hour: new Date(jamKeluar).getHours(),
      minute: new Date(jamKeluar).getMinutes(),
      second: 0,
      millisecond: 0,
    });

    const jamKeluarsStart = jamKeluars;
    const jamKeluarsEnd = jamKeluars.plus({ hours: 1 }); // Ditambah 1 jam

    const isWithinPulangTime =
      serverTimeMillis >= jamKeluarsStart.toMillis() &&
      serverTimeMillis <= jamKeluarsEnd.toMillis();

    return !isWithinPulangTime; // Tombol dinonaktifkan jika tidak dalam rentang waktu
  };

  const fetchLocalIPAddress = () => {
    return new Promise((resolve, reject) => {
      const localIPs = new Set();
      const rtcPeerConnection = new RTCPeerConnection({
        iceServers: [],
      });

      rtcPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          const regex = /(?:\d{1,3}\.){3}\d{1,3}/;
          const ipMatch = candidate.match(regex);
          if (ipMatch) {
            localIPs.add(ipMatch[0]);
          }
        } else {
          // Jika kandidat selesai, kembalikan hasil
          resolve(Array.from(localIPs));
          rtcPeerConnection.close();
        }
      };

      rtcPeerConnection.createDataChannel(""); // Buat data channel untuk memulai proses
      rtcPeerConnection
        .createOffer()
        .then((offer) => rtcPeerConnection.setLocalDescription(offer))
        .catch((error) => reject(error));
    });
  };

  useEffect(() => {
    fetchLocalIPAddress()
      .then((ips) => {
        setIplocal(ips[0]);
      })
      .catch((error) => {
        console.error("Gagal mendapatkan IP lokal:", error);
      });
  }, []);

  useEffect(() => {
    const measurePing = async () => {
      const startTime = Date.now(); // Catat waktu awal

      try {
        await fetch(API_URL + "/connection", { method: "HEAD" }); // Kirim request
        const endTime = Date.now(); // Catat waktu akhir
        setPing(endTime - startTime); // Hitung latensi
      } catch (error) {
        setPing(30);
      }
    };

    // Jalankan setiap 60 detik (60000 ms)
    const pingInterval = setInterval(measurePing, 60000);
    measurePing(); // Jalankan pertama kali saat komponen mount

    return () => clearInterval(pingInterval); // Bersihkan interval saat komponen unmount
  }, []);

  const getPingClass = () => {
    if (ping < 80) {
      return "text-green-500"; // Hijau jika ping < 80
    } else if (ping >= 80 && ping < 180) {
      return "text-orange-500"; // Oranye jika ping >= 80 dan < 180
    } else if (ping >= 180) {
      return "text-red-500"; // Merah jika ping >= 180
    }
    return ""; // Default jika ping belum tersedia
  };

  const handlePulang = async (id) => {
    setLoading(true);
    const currentDate = new Date(user?.DateIndonesia); // Tanggal yang diberikan

    // Manipulasi waktu
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Pastikan format ISO
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    currentDate.setSeconds(seconds);

    const isoString = currentDate.toISOString();
    try {
      await handlePulangs({
        id: id,
        jam_pulang: isoString,
      });
      toast.success("Berhasil absen pulang", {
        duration: 1500,
        onAutoClose: () => window.location.reload(),
      });
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
      }
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  const [showNavbar, setShowNavbar] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="">
      <div className="min-h-screen  bg-gray-100 pb-8">
        <>
          <Tools title={"Dashboard"} role={role} />
          {!modal && (
            <div>
              <div
                className={`transform transition-transform duration-500 ease-in-out ${
                  showNavbar ? "translate-y-0" : "-translate-y-full"
                } bg-blue fixed top-0 left-0 right-0 z-20 border-b-4 border-orange-300`}
              >
                <div className=" py-2 px-4 flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <img
                      onClick={() => navigate(`/app/profil`)}
                      src={user?.avatar}
                      loading="lazy"
                      alt=""
                      className="border-2  w-12 h-12 hover:cursor-pointer border-white rounded-full"
                    />
                    <div>
                      <h1 className="text-white font-bold text-base ">
                        Hi, {user?.name}
                      </h1>
                      {user && user.Kelas && user.Kelas.length > 0 ? (
                        <p className="text-white text-xs">
                          {user.Kelas[0]?.nama} | {user.nim}
                        </p>
                      ) : (
                        <p className="text-white text-sm">- | {user.nim}</p>
                      )}
                    </div>
                  </div>
                  <nav className="flex space-x-4">
                    <button
                      disabled={loadingLogout}
                      title="Logout"
                      onClick={() => logout()}
                      className="bg-white text-xs text-blue py-2 px-4 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        {loadingLogout ? (
                          <>
                            <BeatLoader color={"#1e3a8a"} size={8} margin={2} />
                          </>
                        ) : (
                          <>
                            <FaSignOutAlt />
                          </>
                        )}
                      </div>
                    </button>
                  </nav>
                </div>
              </div>

              <div
                className={`bg-blue pb-40 border-b-8 border-oren py-16 rounded-bl-[35px] rounded-br-[35px] ${
                  showNavbar ? "opacity-0  " : "opacity-100  "
                } `}
              >
                {/* <Headers user={user} /> */}

                <div className="px-6 -mt-8">
                  <div className="flex  gap-4 items-center justify-between ">
                    <div className="flex gap-4 items-center">
                      <img
                        onClick={() => navigate(`/app/profil`)}
                        src={user?.avatar}
                        loading="lazy"
                        alt=""
                        className="border-2 lg:w-16 lg:h-16 md:w-16 md:h-16 w-12 h-12 hover:cursor-pointer border-white rounded-full"
                      />
                      <div>
                        <h1 className="text-white font-bold lg:text-xl md:text-xl text-base mt-2">
                          Hi, {user?.name}
                        </h1>
                        {user && user.Kelas && user.Kelas.length > 0 ? (
                          <p className="text-white text-xs">
                            {user.Kelas[0]?.nama} | {user.nim}
                          </p>
                        ) : (
                          <p className="text-white text-sm">- | {user.nim}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <button
                        disabled={loadingLogout}
                        title="Logout"
                        onClick={() => logout()}
                        className="bg-white text-xs text-blue py-2 px-4 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          {loadingLogout ? (
                            <>
                              <BeatLoader
                                color={"#1e3a8a"}
                                size={8}
                                margin={2}
                              />
                            </>
                          ) : (
                            <>
                              <FaSignOutAlt />
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 -mt-36 ">
                <div className=" px-4 bg-white p-4 mt-4 rounded-lg shadow">
                  <div className="flex-col flex">
                    <div className="flex gap-2 items-center text-sm">
                      <FaRegCalendar size={24} className="text-blue" />
                      <p className="font-bold text-sm">
                        {formatTanggal(user?.tanggal)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {absenToday !== null ? (
                        <div className="flex flex-col gap-2">
                          <h1 className="text-center mt-4 font-medium text-gray-600 text-sm">
                            Tempat PKL
                          </h1>
                          {user?.Pkl?.length > 0 && (
                            <div>
                              <h1 className="text-center font-extrabold text-blue">
                                {user?.Pkl[0]?.name}
                              </h1>
                              <p className="text-center text-sm text-blue font-bold">
                                Shift - {nameShift}
                              </p>
                            </div>
                          )}

                          <>
                            {absenToday.hadir === "selesai" ? (
                              <>
                                <div className="flex justify-center">
                                  <div className="flex justify-center items-center gap-2 mt-4 bg-green-100 w-fit py-2 px-4 rounded-lg shadow-md">
                                    <FaCheck className="text-green-600 text-xl " />
                                    <h1 className="text-center text-sm font-semibold text-green-700 ">
                                      Kamu sudah absen! 🎉
                                    </h1>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex justify-center gap-4 mt-4">
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => setModal1(true)}
                                    disabled={
                                      isMasukDisabled() ||
                                      absenToday.hadir === "hadir" ||
                                      absenToday.hadir === "selesai"
                                    }
                                    className={`${
                                      absenToday.hadir !== "hadir" &&
                                      absenToday.hadir !== "selesai"
                                        ? "bg-blue disabled:bg-gray-500"
                                        : "bg-green-600"
                                    } disabled:hover:opacity-100 disabled:cursor-not-allowed  hover:opacity-85 transition-all  text-white md:w-64 lg:w-64 w-36 py-3  rounded-md`}
                                  >
                                    {absenToday.hadir === "hadir" ||
                                    absenToday.hadir === "selesai" ? (
                                      <div className="flex items-center justify-center gap-2 text-sm">
                                        <FaCheck />
                                        <p>Sudah Absen</p>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center gap-2 text-sm">
                                        <FaSignInAlt />
                                        <p>Masuk</p>
                                      </div>
                                    )}
                                  </button>
                                  <div className="flex gap-1 items-center justify-center text-xs text-red-500 font-bold">
                                    <FaClock />

                                    <h1>
                                      <div className="flex items-center">
                                        <div className="flex">
                                          <p>
                                            {jamMasukHours
                                              .toString()
                                              .padStart(2, "0")}
                                            :
                                            {jamMasukMinutes
                                              .toString()
                                              .padStart(2, "0")}{" "}
                                            -
                                          </p>
                                        </div>
                                        <div className="flex ml-1">
                                          <p>
                                            {DateTime.fromISO(jamMasuk)
                                              .plus({ minutes: 15 })
                                              .hour.toString()
                                              .padStart(2, "0")}
                                            :
                                          </p>
                                          <p>
                                            {DateTime.fromISO(jamMasuk)
                                              .plus({ minutes: 15 })
                                              .minute.toString()
                                              .padStart(2, "0")}
                                          </p>
                                        </div>
                                      </div>
                                    </h1>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                  <button
                                    disabled={
                                      isPulangDisabled() ||
                                      absenToday.pulang !== null ||
                                      loading
                                    }
                                    onClick={() => handlePulang(absenToday.id)}
                                    className="border disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-white text-sm disabled:hover:opacity-100 hover:opacity-85 transition-all md:w-64 lg:w-64 w-36 text-black  py-3  rounded-md"
                                  >
                                    <div className="flex items-center justify-center gap-2">
                                      {absenToday.pulang !== null ? (
                                        <>
                                          <div className="flex    items-center justify-center gap-2 text-sm">
                                            <FaCheck />
                                            <p>Sudah Pulang</p>
                                          </div>
                                        </>
                                      ) : (
                                        <LoadingButton
                                          loading={loading}
                                          icon={<FaSignOutAlt />}
                                          text={"Pulang"}
                                        />
                                      )}
                                    </div>
                                  </button>
                                  <div className="flex gap-1 items-center justify-center text-xs text-red-500 font-bold">
                                    <FaClock />

                                    <h1>
                                      <div className="flex items-center">
                                        <div className="flex">
                                          <p>
                                            {new Date(jamKeluar)
                                              .getHours()
                                              .toString()
                                              .padStart(2, "0")}
                                            :
                                          </p>
                                          <p>
                                            {new Date(jamKeluar)
                                              .getMinutes()
                                              .toString()
                                              .padStart(2, "0")}{" "}
                                            -{" "}
                                          </p>
                                        </div>
                                        <div className="flex ml-1">
                                          <p>
                                            {new Date(jamKeluar).getHours() + 1}
                                            :
                                          </p>
                                          <p>
                                            {new Date(jamKeluar).getMinutes()}
                                          </p>
                                        </div>
                                      </div>
                                    </h1>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        </div>
                      ) : (
                        <>
                          {/* Jika user belum memiliki tempat PKL */}
                          {!user?.Pkl || user.Pkl.length === 0 ? (
                            <div className="mt-4 flex flex-col gap-2 items-center justify-center">
                              <FaTimesCircle
                                size={30}
                                className="text-red-500"
                              />
                              <h1 className="font-bold text-sm text-center">
                                Kamu Belum memiliki tempat PKL & absensi
                              </h1>
                            </div>
                          ) : user.Pkl[0]?.status ? (
                            <div className="mt-4">
                              <h1 className="text-center font-extrabold text-blue">
                                {user.Pkl[0].name}
                              </h1>
                              <h1 className="text-center font-bold text-red-500 text-sm mt-2">
                                <p>
                                  Tidak ada absensi untuk hari ini, silahkan cek
                                  kalender untuk info lebih lanjut
                                </p>
                              </h1>
                            </div>
                          ) : (
                            <div className="mt-4 flex flex-col gap-2 items-center justify-center">
                              <FaTimesCircle
                                size={30}
                                className="text-red-500"
                              />
                              <h1 className="font-bold text-red-500 text-sm text-center">
                                Periode PKL telah berakhir
                              </h1>
                            </div>
                          )}
                        </>
                      )}
                      <div className="mt-3">
                        <h1 className="text-center text-black md:text-base lg:text-base text-sm">
                          Lokasi Anda saat ini :
                        </h1>

                        <div className="bg-gray-200 px-5  mt-1 py-4 flex items-center justify-center  flex-col  gap-2">
                          <FaMapMarkerAlt size={20} className="text-red-500 " />
                          {locationError ? (
                            <>
                              <h1 className="text-center text-sm">
                                {locationError}
                              </h1>
                            </>
                          ) : (
                            <>
                              <h1 className="text-center text-sm">
                                {location.address || (
                                  <BeatLoader
                                    color="#294a70"
                                    className="text-blue mt-2"
                                  />
                                )}
                              </h1>
                              <div className="flex flex-col items-center gap-1 w-full">
                                <div className="flex w-full justify-center items-center">
                                  <div className="flex  gap-2 justify-center items-center text-xs">
                                    <FaWifi className="text-blue text-xl" />
                                    <p>
                                      {iplocal}{" "}
                                      <span
                                        className={
                                          getPingClass() + " font-bold"
                                        }
                                      >
                                        ({ping}ms)
                                      </span>
                                    </p>
                                  </div>
                                  {/* <div className="flex  gap-2 justify-center items-center text-xs">
                                  <FaGlobe className="text-blue text-xl" />
                                  <p>{ip.ip}</p>
                                </div> */}
                                </div>
                                <p
                                  onClick={() => {
                                    // const gmapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                                    // window.open(gmapsUrl, "_blank");
                                    setModalMaps(true);
                                  }}
                                  className="text-xs border-dashed border-t border-gray-400 w-full text-center pt-3 cursor-pointer hover:underline"
                                >
                                  <div className="flex gap-2 justify-center items-center">
                                    <FaMapLocation className="text-blue text-xl" />
                                    <p>
                                      {location.latitude}, {location.longitude}
                                    </p>
                                  </div>
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 mt-8 pb-24">
                <h1 className="text-base font-bold">Menu</h1>
                <p className="text-xs dark:text-gray-300 text-gray-500">
                  Silahkan pilih menu yang digunakan
                </p>
                <ContentUser />
              </div>
            </div>
          )}

          <ButtonNav />
        </>

        {modalMaps && (
          <ActModal
            isModalOpen={modalMaps}
            title={"Lokasi Saya"}
            setIsModalOpen={setModalMaps}
          >
            <iframe
              width="100%"
              height="500"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&output=embed`}
            ></iframe>
          </ActModal>
        )}
        {modal && (
          <ActModal isModalOpen={modal} title={"Notification"}>
            {next ? (
              <>
                <form onSubmit={updateData}>
                  <Input
                    type={"text"}
                    placeholder={"Name"}
                    label={"Nama"}
                    value={user?.name}
                    disabled={true}
                    required
                  />
                  <Input
                    type={"text"}
                    placeholder={"NISN"}
                    label={"NISN"}
                    value={user?.nim}
                    disabled={true}
                    required
                  />
                  <Input
                    type={"email"}
                    placeholder={"Lengkapi email"}
                    label={"Email"}
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    required
                  />
                  {user?.Kelas?.length !== 1 && (
                    <>
                      <div className="mt-4">
                        <label htmlFor="kelas" className="block font-bold mb-2">
                          Pilih Kelas
                        </label>
                        <Select
                          options={kelasOptions}
                          value={kelasOptions.find(
                            (option) => option.value === user?.kelas?.id
                          )}
                          onChange={setSelectedKelas}
                          isLoading={loading1}
                          required
                          placeholder="Pilih kelas ..."
                        />
                      </div>
                    </>
                  )}
                  <button className="w-full bg-blue py-2 px-4 text-white rounded-lg hover:opacity-85 transition-all duration-300 ease-in mt-4">
                    <LoadingButton
                      text={"Simpan"}
                      loading={loading}
                      icon={<FaSave />}
                    />
                  </button>
                </form>
              </>
            ) : (
              <div>
                <h1 className="text-base font-bold">Mohon lengkapi profil</h1>
                <div className="flex justify-end">
                  <button
                    onClick={() => setNext(true)}
                    className="bg-blue text-white px-4 py-2 rounded hover:opacity-85 transition-all duration-300 ease-in"
                  >
                    Lengkapi profil
                  </button>
                </div>
              </div>
            )}
          </ActModal>
        )}
        {modal1 && (
          <ActModal
            isModalOpen={modal1}
            setIsModalOpen={setModal1}
            title="Absen Masuk"
          >
            {" "}
            <ModalAbsens id={absenToday.id} tanggal={currentDate} />
          </ActModal>
        )}
      </div>
    </div>
  );
};

export default MainUsers;
