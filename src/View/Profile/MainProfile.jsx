import React, { useEffect, useRef, useState } from "react";
import ContainerGlobal from "../../components/ContainerGlobal";
import useAuthStore from "../../Lib/Zustand/AuthStore";
import Input from "../../components/Input";
import { FaPencilAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa"; // Import WhatsApp icon
import ActModal from "../../components/Modal/ActModal";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import { toast } from "sonner";
import {
  updateFotoProfile,
  uploadProfile,
} from "../../Api/Services/LoginServices";
import LoadingButton from "../../components/LoadingButton";
import Calendar from "../../components/Table/Calendar";

const MainProfile = () => {
  const { user, setUser } = useAuthStore();
  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(user?.avatar);
  const [loading, setLoading] = useState(false);

  const data = user;
  console.log(data);
  const toastCalled = useRef(false);
  useEffect(() => {
    const path = window.location.pathname;

    if (path === "/app/profil" || user?.role === "pembimbing") {
      if (!toastCalled.current) {
        toast.info(
          "Hubungi administrator sekolah jika NISN atau Nama tidak sesuai.",
          {
            duration: 10000,
            position: "bottom-left",
          }
        );
        toastCalled.current = true;
      }
    } else {
      toast.dismiss();
      toastCalled.current = false;
    }
  }, [window.location.pathname]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      toast.info("Ukuran file maksimal 5MB.");
      return;
    }
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onClose = () => {
    setModal(false);
    setSelectedImage(null);
    setPreview(user?.avatar);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      toast.error("Tidak ada gambar yang dipilih.");
      return;
    }
    try {
      const fileTypes = ["image/jpeg", "image/png", "image/jpg", "image/JPG"];
      if (!fileTypes.includes(selectedImage.type)) {
        toast.error("File harus berupa gambar (jpg, jpeg, png).");
        return;
      }

      if (selectedImage) {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", selectedImage);
        const response = await uploadProfile(formData);
        console.log(response);

        if (response.status === 200) {
          console.log(response.file_url);
          await updateFotoProfile({
            id: user?.id,
            image_url: response.data.file_url,
          });
          toast.success("Foto profil berhasil diperbarui.");
          setModal(false);
          setUser({ ...user, avatar: response.data.file_url });
        } else {
          toast.error("Foto profil gagal diperbarui.");
        }
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
       
      }
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerGlobal>
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <img
            src={preview}
            alt="profile"
            onClick={() => window.open(preview, "_blank")}
            className="w-32 h-32 cursor-pointer rounded-full object-cover border-2 border-gray-200"
          />
          <button
            onClick={() => setModal(!modal)}
            className="absolute bg-blue bottom-0 right-2 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
          >
            <FaPencilAlt className="text-sm" />
          </button>
        </div>
        <Input value={user?.nim} label={"NIP / NISN"} disabled />
        <Input
          value={user?.name}
          label={"Nama"}
          placeholder={"Belum ada nama"}
          disabled
        />
        <Input
          value={user?.Kelas[0]?.nama}
          label={"Kelas / Jurusan"}
          placeholder={"Belum ada kelas"}
          disabled
        />
        <Input
          value={user?.email}
          label={"Email"}
          placeholder={"Belum ada email"}
          disabled
        />
      </div>

      {modal && (
        <ActModal
          title={"Ganti Foto Profile"}
          isModalOpen={modal}
          setIsModalOpen={onClose}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/JPG"
                onChange={handleImageChange}
                required
                className="mt-2"
              />
              <button
                type="submit"
                disabled={loading}
                onClick={handleSave}
                className="bg-blue hover:bg-opacity-80 text-white py-2 px-4 rounded-md"
              >
                <LoadingButton text={"Simpan"} loading={loading} />
              </button>
            </form>
          </div>
        </ActModal>
      )}
      {user?.role === "user" && (
        <>
          {data?.Pkl[0]?.absensi && data?.Pkl[0]?.absensi.length > 0 ? (
            <Calendar data={data?.Pkl[0]?.absensi} />
          ) : (
            <div className="flex justify-center items-center text-xl font-bold text-gray-700 mt-4"></div>
          )}
        </>
      )}

      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-10 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 focus:outline-none flex items-center gap-2"
      >
        <FaWhatsapp size={30} />
        <span className="text-white text-sm">Administrator</span>
      </a>
    </ContainerGlobal>
  );
};

export default MainProfile;
