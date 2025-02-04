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
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
const ModalAbsens = ({ tanggal, id }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: null,
  });
  const [loadings, setLoadings] = useState(false);
  const [crop, setCrop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [apikeys, setApikeys] = useState([
    "155de109609643f9a1b432e22774f675",
    "1de3b41c01ef4a50a5a37b954081b6b4",
    "8c45cf1167774a22913483caa6b3d3c1",
    "2c316c1b439147b2b42e794724c4edb5",
  ]);

  // const startCamera = async () => {
  //   try {
  //     // Meminta izin kamera
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: {
  //         facingMode: "user",
  //         frameRate: { max: 30 },
  //         displaySurface: "monitor",
  //         aspectRatio: { min: 1, max: 1 },
  //       },
  //     });

  //     if (videoRef.current) {
  //       videoRef.current.srcObject = stream;
  //       setCameraError(null);
  //     } else {
  //       console.error("videoRef.current is null");
  //       setCameraError("Elemen video tidak ditemukan.");
  //     }
  //   } catch (error) {
  //     console.error("Error accessing camera:", error);
  //     setCameraError(
  //       "Kamera tidak diizinkan atau tidak tersedia. Periksa izin kamera dari browser."
  //     );
  //   }
  // };
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          frameRate: { max: 30 },
          displaySurface: "monitor",
          aspectRatio: { min: 1, max: 1 },
          backgroundBlur : true
        },
      });

      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();
      if (capabilities.facingMode === "user") {
        setIsFrontCamera(true); // Menandakan kamera depan
      } else {
        setIsFrontCamera(false); // Menandakan kamera belakang
      }

      // Pastikan kita memiliki videoRef dan canvasRef
      if (videoRef.current && canvasRef.current) {
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        const context = canvasElement.getContext("2d");

        // Mengatur elemen video untuk menerima stream
        videoElement.srcObject = stream;

        // Set up untuk menampilkan video pada canvas
        const videoTrack = stream.getVideoTracks()[0];
        const videoSettings = videoTrack.getSettings();

        // Menyesuaikan ukuran canvas dengan ukuran video
        canvasElement.width = videoSettings.width;
        canvasElement.height = videoSettings.height;

        // Menggambar video pada canvas dan menghilangkan efek mirror
        videoElement.play();

        const draw = () => {
          context.drawImage(
            videoElement,
            0,
            0,
            canvasElement.width,
            canvasElement.height
          );
          requestAnimationFrame(draw); // Menarik frame video
        };

        draw(); // Mulai menggambar

        // Menampilkan video tanpa efek mirror
        videoElement.style.transform = "scaleX(1)"; // Memastikan video tidak ter-mirror

        setCameraError(null);
      } else {
        console.error(
          "videoRef.current atau canvasRef.current tidak ditemukan"
        );
        setCameraError("Elemen video atau canvas tidak ditemukan.");
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

    if (!cropData) {
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

      if (cropData) {
        const timestamp = Date.now();
        const uniqueFileName = `photo_${timestamp}.png`;
        const formData = new FormData();
        formData.append("file", cropData, uniqueFileName);
        const uploadFoto = await uploadProfile(formData);

        if (uploadFoto.data.status === "success") {
          await HandleHadir({
            id: id,
            jam_masuk: isoString,
            gps: `${location.latitude},${location.longitude}`,
            posisi: location.address,
            foto: uploadFoto.data.file_url,
          });

          toast.success("Absen Berhasil", {
            duration: 2000,
            onAutoClose: () => window.location.reload(),
          });
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
        ),
          setLoading(false);
        setLocationPermission(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
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

      canvas.toBlob(
        (blob) => {
          setPhoto(blob);
        },
        "image/png",
        1
      );
    }
  };

  return (
    <div className="">
      {cameraError && (
        <p className="text-red-500 text-center text-sm"> # {cameraError}</p>
      )}

      <div className="camera mb-4 ">
        <h1 className="flex justify-center "></h1>
        <video
          ref={videoRef}
          autoPlay
          muted
          controls={false}
          style={{
            transform: isFrontCamera ? "scaleX(-1)" : "scaleX(1)", // Menambahkan kondisi scaleX
          }}
          playsInline
          onContextMenu={(e) => e.preventDefault()}
          className={`w-full camera_feed_flip ${
            cameraError || photo ? "hidden" : ""
          } rounded-lg shadow-md `}
        ></video>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {photo && !cropData && (
        <div className=" mb-4">
          <Cropper
            src={URL.createObjectURL(photo)}
            guides={true}
            viewMode={1}
            dragMode="move"
            zoomable={true}
            scalable={true}
            cropBoxResizable={true}
            background={true}
            minCropBoxWidth={100}
            minCropBoxHeight={100}
            onInitialized={(instance) => {
              setCropper(instance), setCrop(true);
            }}
          />
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => {
                if (cropper) {
                  cropper.getCroppedCanvas().toBlob((blob) => {
                    {
                      setCropData(blob), setCrop(false);
                    }
                  }, "image/png");
                }
              }}
              className="bg-blue w-32 text-white text-sm px-4 py-2 rounded-md"
            >
              Simpan
            </button>
            <button
              onClick={() => {
                setPhoto(null), setCropData(null), setCrop(false);
              }}
              className="bg-red-500 w-32 text-white text-sm px-4 py-2 rounded-md"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* preview crop */}

      {cropData && (
        <div className="flex justify-center  w-full">
          <img
            src={URL.createObjectURL(cropData)}
            alt="Preview"
            className="w-full rounded-lg"
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
              className="text-xs mt-1 w-fit cursor-pointer hover:underline"
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
      {!crop ? (
        <div className="flex justify-center gap-2 items-center">
          {photo ? (
            <button
              onClick={() => {
                setPhoto(null), setCropData(null);
              }}
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
              className="bg-blue hover:opacity-85 transition-all duration-300 ease-in-out hover:scale-95 flex disabled:bg-gray-500 diasbled:cursor-not-allowed justify-center text-sm text-white px-8 py-8 rounded-full"
            >
              <div className="flex items-center gap-2">
                <FaCamera size={20} />
              </div>
            </button>
          )}

          {photo && (
            <button
              onClick={handleCheckIn}
              disabled={loadings}
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
          )}
        </div>
      ) : (
        <div className="flex justify-center gap-2 items-center">
          {!crop && (
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
        </div>
      )}
    </div>
  );
};

export default ModalAbsens;
