import React, { useEffect, useState } from "react";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import { ForgotPassword, getDataUser } from "../../Api/Services/LoginServices";
import useAuthStore from "../Zustand/AuthStore";
import TabStore from "../Zustand/TabStore";
import { toast } from "sonner";

const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { tab, setTab } = TabStore();
  const [userOptions, setUserOptions] = React.useState([]);
  // Menentukan role berdasarkan tab
  const role = tab === "siswa" ? "user" : tab === "pembimbing" ? "pembimbing" : null;

  // Fungsi untuk mengambil data pengguna
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDataUser(role);
      setData(response.data);
    } catch (error) {
      ResponseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memperbarui password
  const updatePasswords = async (id, password) => {
    setLoading(true);
    try {
      await ForgotPassword({
        id: id,
        password: password,
      });
      toast.success("Password berhasil diubah");
      fetchData(); // Memperbarui data setelah password diubah
    } catch (error) {
      ResponseHandler(error);
    } finally {
      setLoading(false);
    }
  };


  
    const getDataUsers = async () => {
      setLoading(true);
      try {
        const response = await getDataUser("user");
  
        const users = response.data;
        // ambil user yang belum ada PKL
        const filteredUsers = users.filter((user) => {
          // Pkl nya null
          return user.Pkl.length === 0;
        });
  
        const options = filteredUsers.map((user) => ({
          value: user.id,
          label: user.name,
        }));
  
        setUserOptions(options);
      } catch (error) {
        ResponseHandler(error.response);
      } finally {
        setLoading(false);
      }
    };

  

  return (
    {
      loading,
      data,
      userOptions,
      fetchData,
      getDataUsers,
      updatePasswords,
   
    }
  );
};

export default useUser;
