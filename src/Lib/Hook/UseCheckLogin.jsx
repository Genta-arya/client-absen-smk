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
    "155de109609643f9a1b432e22774f675",
    "1de3b41c01ef4a50a5a37b954081b6b4",
    "8c45cf1167774a22913483caa6b3d3c1",
    "2c316c1b439147b2b42e794724c4edb5",
  ];

  const getRandomApiKey = () => {
    return apikeys[Math.floor(Math.random() * apikeys.length)];
  };

  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setLocation({ latitude, longitude });

        const apiKey = getRandomApiKey();

        try {
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json`,
            {
              params: {
                q: `${latitude}+${longitude}`,
                key: apiKey,
              },
            }
          );

          const data = response.data;
          if (data.results && data.results[0]) {
            const result = data.results[0];
            const address = result.formatted || "Alamat tidak ditemukan";
            const components = result.components || {};
            const additionalInfo = {
              village: components.village || "Tidak diketahui",
              county: components.county || "Tidak diketahui",
              state: components.state || "Tidak diketahui",
              country: components.country || "Tidak diketahui",
            };

            // Perbarui lokasi
            setLocation({
              address,
              additionalInfo,
            });
          }
        } catch (error) {
          ResponseHandler(error.response);

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
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
        localStorage.removeItem("token");
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
    }, 20000);

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
