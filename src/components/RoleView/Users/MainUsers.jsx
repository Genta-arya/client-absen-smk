import React, { useEffect, useState } from "react";
import Tools from "../../Tools";
import Headers from "../../Headers";
import ButtonNav from "../../ButtonNav";
import ContentUser from "./components/ContentUser";
import useAuthStore from "../../../Lib/Zustand/AuthStore";
import ActModal from "../../Modal/ActModal";
import Input from "../../Input";
import LoadingButton from "../../LoadingButton";
import { FaSave } from "react-icons/fa";
import { updateDataUser } from "../../../Api/Services/LoginServices";
import { ResponseHandler } from "../../../Utils/ResponseHandler";
import { toast } from "sonner";
import { io } from "socket.io-client";

const MainUsers = () => {
  const { user } = useAuthStore();
  const role = user?.role;
  const [modal, setModal] = useState(false);
  const [next, setNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: user?.name,
    nim: user?.nim,
    email: user?.email,
  });

  useEffect(() => {
    const socket = io("http://localhost:8080", {
      withCredentials: true,
    });

    const userId = user?.id;
    socket.emit("joinRoom", userId);

    socket.on("new-pkl-notification", (data) => {
      if (Notification.permission === "granted") {
        new Notification("PKL Notification", {
          body: data.message,
          icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScfqgzc3z4pYYehdJbSmuMT8Gp7abIEiE-zw&s", // Ganti dengan path ke ikon yang Anda inginkan
        });
      }

      toast.info(data.message);
    });

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    if (user?.email === null) {
      setModal(true);
    }
  }, [user]);

  const updateData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDataUser({
        id: user?.id,
        name: user?.name,
        nim: user?.nim,
        email: data.email,
      });

      toast.success("Data berhasil diperbarui");

      window.location.reload();
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <>
        <Tools title={"Dashboard"} role={role} />
        {!modal && (
          <>
            <Headers user={user} />
            <ContentUser />
          </>
        )}

        <ButtonNav />
      </>
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
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                />
                <button className="w-full bg-blue py-2 px-4 text-white rounded-lg hover:opacity-85 transition-all duration-300 ease-in ">
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
                  <p className="text-blue-600">Lengkapi profil</p>
                </button>
              </div>
            </div>
          )}
        </ActModal>
      )}
    </div>
  );
};

export default MainUsers;
