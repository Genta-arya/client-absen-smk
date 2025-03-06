import React, { useEffect, useState } from "react";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import { CheckSession } from "../../Api/Services/LoginServices";
import useAuthStore from "../Zustand/AuthStore";
import useLocationStore from "../Zustand/useLocationStore";
import { toast } from "sonner";
import { Axios } from "../../Api/AxiosConfig/Axios";
import axios from "axios";

const UseCheckLogin = () => {
  const { user, setUser } = useAuthStore();

  const { setLocation, setLocationError, setIp, setLocationPermission } =
    useLocationStore();

  const [loading, setLoading] = useState(false);

  const apikeys = [
    "a18b1d0c7865431c9d6456b675c290d6",
    "da54aa09d48544dbb3b6bad576e1a119",
  ]; // Tambahkan API key lain jika ada
  const getRandomApiKey = () => {
    return apikeys[Math.floor(Math.random() * apikeys.length)];
  };
  // const fetchLocation = () => {
  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;

  //       setLocation({ latitude, longitude });

  //       try {
  //         const response = await axios.get(
  //           `https://nominatim.openstreetmap.org/reverse`,
  //           {
  //             params: {
  //               lat: latitude,
  //               lon: longitude,
  //               format: "json",
  //             },
  //           }
  //         );

  //         const data = response.data;
  //         const address = data.display_name || "Alamat tidak ditemukan";
  //         const details = data.address || {};

  //         const additionalInfo = {
  //           village:
  //             details.village ||
  //             details.hamlet ||
  //             details.suburb ||
  //             "Tidak diketahui",
  //           county: details.county || "Tidak diketahui",
  //           state: details.state || "Tidak diketahui",
  //           country: details.country || "Tidak diketahui",
  //         };

  //         // Perbarui lokasi
  //         setLocation({
  //           address,
  //           additionalInfo,
  //         });
  //       } catch (error) {
  //         ResponseHandler(error.response);
  //         console.error("Gagal mengambil alamat lokasi:", error);

  //         setLocationError("Gagal mengambil alamat lokasi.");
  //       } finally {
  //         setLocationPermission(true);
  //       }
  //     },
  //     (error) => {
  //       setLocationError(
  //         "Lokasi tidak diizinkan atau tidak tersedia. Periksa izin lokasi dari browser."
  //       );

  //       setLocationPermission(false);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //     }
  //   );
  // };
  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: {
                lat: latitude,
                lon: longitude,
                format: "json",
              },
            }
          );

          if (!response.data || response.status !== 200) {
            throw new Error("Data dari Nominatim tidak valid.");
          }

          const data = response.data;
          const address = data.display_name || "Alamat tidak ditemukan";
          const details = data.address || {};

          const additionalInfo = {
            village:
              details.village ||
              details.hamlet ||
              details.suburb ||
              "Tidak diketahui",
            county: details.county || "Tidak diketahui",
            state: details.state || "Tidak diketahui",
            country: details.country || "Tidak diketahui",
          };

          setLocation({
            address,
            additionalInfo,
          });
        } catch (error) {
          console.error("Gagal mengambil alamat lokasi:", error);

          if (error.code === "ECONNABORTED") {
            setLocationError(
              "Permintaan lokasi gagal didapatkan. tunggu sebentar"
            );
          } else if (error.response && error.response.status === 429) {
            setLocationError("Terlalu banyak permintaan. Coba lagi nanti.");
          } else {
            setLocationError("Gagal mengambil alamat lokasi. Coba lagi nanti.");
          }

          // **Fallback ke Google Maps atau lokasi default**
          fallbackToOpenCage(latitude, longitude);
        } finally {
          setLocationPermission(true);
        }
      },
      (error) => {
        setLocationError(
          "Lokasi tidak diizinkan atau tidak tersedia. Periksa izin lokasi dari browser."
        );
        setLocationPermission(false);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  const fetchIpAddress = async () => {
    try {
      const responses = await axios.get("https://ipwhois.app/json/");
      setIp(responses.data);
    } catch (error) {
      console.error("Gagal mengambil alamat IP:", error);
    }
  };

  const fallbackToOpenCage = async (latitude, longitude) => {
    try {
      const apiKey = getRandomApiKey(); // Ambil API key secara acak

      const response = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q: `${latitude},${longitude}`,
            key: apiKey,
            language: "id",
          },
        }
      );

      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted;
        const details = response.data.results[0].components || {};

        const additionalInfo = {
          village:
            details.village ||
            details.hamlet ||
            details.suburb ||
            "Tidak diketahui",
          county: details.county || "Tidak diketahui",
          state: details.state || "Tidak diketahui",
          country: details.country || "Tidak diketahui",
        };

        setLocation({
          latitude,
          longitude,
          address,
          additionalInfo,
        });

        // Jika berhasil mendapatkan alamat dari OpenCage, set error menjadi null
        setLocationError(null);
      } else {
        throw new Error("OpenCage tidak bisa menemukan alamat.");
      }
    } catch (error) {
      console.error("Gagal mendapatkan alamat dari OpenCage:", error);
      setLocationError("Gagal mendapatkan alamat, coba lagi nanti.");
    }
  };

  const fetch = async () => {
    setLoading(true);

    try {
      const response = await CheckSession();
      setUser(response.data);
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
        localStorage.removeItem("token");
        window.location.href = "/";
      }
      ResponseHandler(error.response, "/");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpAddress();
  }, []);

  useEffect(() => {
    // Panggil pertama kali saat komponen dipasang
    fetchLocation();

    // Set interval untuk refetch setiap 20 detik
    const interval = setInterval(() => {
      fetchLocation();
    }, 60000);

    // Membersihkan interval saat komponen di-unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch();
  }, []);

  return {
    user,
    loading,
  };
};

export default UseCheckLogin;
