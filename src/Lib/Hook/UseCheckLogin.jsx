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

  const apikeys = ["dc454f6bd4674457a064545e9e6960c0"];

  const getRandomApiKey = () => {
    return apikeys[Math.floor(Math.random() * apikeys.length)];
  };

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

          // Perbarui lokasi
          setLocation({
            address,
            additionalInfo,
          });
        } catch (error) {
          ResponseHandler(error.response);
          console.error("Gagal mengambil alamat lokasi:", error);

          setLocationError("Gagal mengambil alamat lokasi.");
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
