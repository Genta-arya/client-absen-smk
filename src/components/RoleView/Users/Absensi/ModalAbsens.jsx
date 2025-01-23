import React, { useEffect, useRef, useState } from "react";
import {
  FaCamera,
  FaCheck,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";
import { uploadProfile } from "../../../../Api/Services/LoginServices";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import { HandleHadir } from "../../../../Api/Services/AbsensiServices";
import LoadingButton from "../../../LoadingButton";

const ModalAbsens = ({ tanggal, utc, id }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: null,
  });
  const [loadings, setLoadings] = useState(false);

  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [apikeys, setApikeys] = useState([
    "7ba09287e7a5442bb3cc94465e1ed244",
    "1de3b41c01ef4a50a5a37b954081b6b4",
    "8c45cf1167774a22913483caa6b3d3c1",
    "2c316c1b439147b2b42e794724c4edb5",
  ]);

  const startCamera = async () => {
    try {
      // Meminta izin kamera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      // Pastikan videoRef.current sudah ada sebelum mengatur srcObject
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraError(null); // Menghapus pesan error jika berhasil
      } else {
        console.error("videoRef.current is null");
        setCameraError("Elemen video tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(
        "Kamera tidak diizinkan atau tidak tersedia. Periksa izin kamera dari browser."
      );
    }
  };

  const handleCheckIn = async () => {
    if (!location.latitude || !location.longitude || !location.address) {
      toast.info("Lengkapi lokasi dan foto sebelum absen.");
      return;
    }

    if (!photo) {
      toast.info("Silahkan foto dulu.");
      return;
    }
    setLoadings(true);

    try {
      // Mengonversi tanggal ke UTC+7
      const currentDate = new Date(tanggal); // Tanggal yang diberikan

      // Manipulasi waktu
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();

      // Pastikan format ISO
      currentDate.setHours(hours);
      currentDate.setMinutes(minutes);
      currentDate.setSeconds(seconds);

      const isoString = currentDate.toISOString();

      console.log(isoString);
      console.log(currentDate);

      if (photo) {
        const timestamp = Date.now(); // Timestamp untuk nama unik
        const uniqueFileName = `photo_${timestamp}.png`;
        const formData = new FormData();
        formData.append("file", photo, uniqueFileName);
        const uploadFoto = await uploadProfile(formData);

        if (uploadFoto.data.status === "success") {
          await HandleHadir({
            id: id,
            jam_masuk: isoString,
            gps: `${location.latitude},${location.longitude}`,
            posisi: location.address,
            foto: uploadFoto.data.file_url,
          });

          console.log({
            id: id,
            jam_masuk: isoString,
            gps: `${location.latitude},${location.longitude}`,
            posisi: location.address,
            foto: uploadFoto.data.file_url,
          });
          toast.success("Absen Berhasil");
          window.location.reload();
        } else {
          toast.error("Foto absensi gagal diupload");
        }
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
      }
      ResponseHandler(error.response);
    } finally {
      setLoadings(false);
    }
  };

  const getRandomApiKey = () => {
    const randomIndex = Math.floor(Math.random() * apikeys.length);
    return apikeys[randomIndex];
  };

  const fetchLocation = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation((prev) => ({ ...prev, latitude, longitude }));

        const apiKey = getRandomApiKey();

        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
          );
          const data = await response.json();
          if (data.results && data.results[0]) {
            setLocation((prev) => ({
              ...prev,
              address: data.results[0].formatted || "Alamat tidak ditemukan",
            }));
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
        setLoading(false);
        setLocationPermission(true);
        setLocationError(null);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError(
          "Lokasi tidak diizinkan atau tidak tersedia. Periksa izin lokasi dari browser."
        );
        setLoading(false);
        setLocationPermission(false);
      }
    );
  };

  useEffect(() => {
    fetchLocation();
    startCamera();
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Mengonversi canvas menjadi Blob
      canvas.toBlob(
        (blob) => {
          setPhoto(blob); // Simpan Blob ke state
        },
        "image/png", // Format gambar
        1 // Kualitas (opsional, default 1)
      );
    }
  };

  return (
    <div className="">
      {cameraError && (
        <p className="text-red-500 text-center text-sm"> # {cameraError}</p>
      )}

      <div className="camera mb-4">
        <h1 className="flex justify-center"></h1>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full ${
            cameraError || photo ? "hidden" : ""
          } rounded-lg shadow-md`}
        ></video>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {photo && (
        <div className="photo-preview mb-4">
          <img
            src={URL.createObjectURL(photo)}
            alt="Captured"
            className="w-full rounded-lg shadow-md"
          />
        </div>
      )}

      {locationError && (
        <p className="text-red-500 text-center  text-sm">{locationError}</p>
      )}

      {locationPermission && !locationError && (
        <p className="mt-4 gap-2  text-xs flex flex-row  items-center mb-8">
          <strong className="">
            <FaMapMarkerAlt size={20} color="red" />
          </strong>
          <div>
            <p className="text-xs ">{location.address || "Belum tersedia"}</p>
            <p
              onClick={() => {
                const mapUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                window.open(mapUrl, "_blank");
              }}
              className="text-xs mt-1 cursor-pointer hover:underline"
            >
              {`${location.latitude}, ${location.longitude}` ||
                "Belum tersedia"}
            </p>
          </div>
        </p>
      )}

      {loading && !locationPermission && (
        <>
          <div className="flex justify-center mt-8 mb-8">
            <BeatLoader size={12} color={"#294a70"} />
          </div>
        </>
      )}

      <div className="flex justify-center gap-2 items-center">
        {photo ? (
          <button
            onClick={() => setPhoto("")}
            disabled={cameraError}
            className="bg-green-500 flex disabled:bg-gray-500 diasbled:cursor-not-allowed justify-center text-sm text-white px-4 py-2 w-36 rounded-md "
          >
            <div className="flex items-center gap-2">
              <FaCamera />
              <p>Ganti Foto</p>
            </div>
          </button>
        ) : (
          <button
            onClick={takePhoto}
            disabled={cameraError}
            className="bg-green-500 flex disabled:bg-gray-500 diasbled:cursor-not-allowed justify-center text-sm text-white px-4 py-2 w-36 rounded-md "
          >
            <div className="flex items-center gap-2">
              <FaCamera />
              <p>Ambil Foto</p>
            </div>
          </button>
        )}

        <button
          onClick={handleCheckIn}
          className="bg-blue text-white text-sm px-4 py-2 w-36 flex justify-center rounded-md"
        >
          <div className="flex items-center gap-2">
            <LoadingButton
              loading={loadings}
              icon={<FaPaperPlane />}
              text="Absen"
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ModalAbsens;
