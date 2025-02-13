import React, { useState, useRef } from "react";
import ContainerGlobal from "../../components/ContainerGlobal";
import useAuthStore from "../../Lib/Zustand/AuthStore";
import Input from "../../components/Input";
import { FaEdit, FaPencilAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa"; // Import WhatsApp icon
import ActModal from "../../components/Modal/ActModal";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import { toast } from "sonner";
import {
  updateFotoProfile,
  updateSingleUser,
  uploadProfile,
} from "../../Api/Services/LoginServices";
import LoadingButton from "../../components/LoadingButton";
import Calendar from "../../components/Table/Calendar";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css"; // Pastikan CSS cropper juga diimport
import axios from "axios";

const MainProfile = () => {
  const { user, setUser } = useAuthStore();
  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(user?.avatar);
  const [loading, setLoading] = useState(false);
  const [cropper, setCropper] = useState(null);
  const [modal1, setModal1] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [statusCrop, setStatusCrop] = useState(false);
  const [email, setEmail] = useState(user?.email);

  const data = user;
  const [whatsapp, setWhatsapp] = useState(
    user?.noHp?.startsWith("628") ? user.noHp : `628${user?.noHp || ""}`
  );
  const handleWhatsappChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Hanya angka
    if (!value.startsWith("628")) {
      value = "628" + value.replace(/^0+/, ""); // Hapus nol di awal jika ada
    }
    setWhatsapp(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.info("Tidak ada file yang dipilih.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.info("Ukuran file maksimal 5MB.");
      return;
    }

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file)); // Menampilkan preview gambar yang dipilih
  };

  const onClose = () => {
    setModal(false);
    setSelectedImage(null);
    setPreview(user?.avatar);
    setCroppedImage(null); // Reset cropped image saat modal ditutup
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!croppedImage) {
      toast.error("Tidak ada gambar yang dipotong.");
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      toast.info("Ukuran file maksimal 5MB.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      const filename = Date.now() + selectedImage.name;
      formData.append("file", croppedImage, filename);
      const response = await uploadProfile(formData);

      if (response.status === 200) {
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
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
      }
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleCrop = () => {
    if (selectedImage.size > 5 * 1024 * 1024) {
      toast.info("Ukuran file maksimal 5MB.");
      return;
    }
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        setCroppedImage(blob);
        setStatusCrop(false);
        setPreview(URL.createObjectURL(blob)); // Menampilkan preview dari hasil crop
      }, "image/png");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSingleUser({
        id: user?.id,
        noHp: whatsapp,

        email: email,
      });
      toast.success("Data berhasil diperbarui", {
        duration: 1500,
        onAutoClose: () => window.location.reload(),
      });
      setModal1(false);
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
    <ContainerGlobal title={"Profile"}>
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <img
            src={preview}
            alt="profile"
            onClick={() => window.open(preview, "_blank")}
            className="w-32 h-32 cursor-pointer rounded-full object-cover border-2 border-gray-200"
          />
          <button
            onClick={() => setModal(true)}
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
        {user?.role === "user" && (
          <Input
            value={user?.Kelas[0]?.nama}
            label={"Kelas / Jurusan"}
            placeholder={"Belum ada kelas"}
            disabled
          />
        )}
        <Input
          value={user?.email}
          label={"Email"}
          placeholder={"Belum ada email"}
          disabled
        />{" "}
        <Input
          value={user?.noHp}
          label={"Whatsapp"}
          placeholder={"Belum ada whatsapp"}
          disabled
        />
      </div>

      <button
        onClick={() => setModal1(true)}
        className="bg-blue text-sm w-full items-center justify-center flex hover:opacity-95 text-white px-4 py-2 rounded-md text-end"
      >
        <div className="flex items-center gap-2">
          <FaEdit />
          <span>Edit Profile</span>
        </div>
      </button>

      {modal && (
        <ActModal
          title={"Ganti Foto Profile"}
          isModalOpen={modal}
          setIsModalOpen={onClose}
        >
          <div className="flex flex-col items-center space-y-4">
            {/* Hanya tampilkan cropper jika ada gambar yang dipilih */}
            {selectedImage && !croppedImage ? (
              <div className="relative">
                <Cropper
                  src={preview}
                  style={{ height: 400 }}
                  initialAspectRatio={1}
                  aspectRatio={1}
                  guides={true}
                  viewMode={1}
                  dragMode="move"
                  scalable={true}
                  cropBoxResizable={true}
                  background={false}
                  onInitialized={(instance) => {
                    setCropper(instance), setStatusCrop(true);
                  }}
                />
              </div>
            ) : (
              <>
                {croppedImage && (
                  <div className="relative">
                    <img
                      // blob
                      src={preview}
                      alt="profile"
                      className="w-32 h-32 cursor-pointer rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
              </>
            )}
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/JPG"
                onChange={handleImageChange}
                placeholder="Pilih gambar"
                required
                className="mt-2"
              />

              {selectedImage && statusCrop ? (
                <>
                  <button
                    type="button"
                    onClick={handleCrop}
                    className="bg-blue text-white text-xs py-2 px-4 rounded-md"
                  >
                    Potong Gambar
                  </button>
                </>
              ) : (
                <>
                  {selectedImage && (
                    <button
                      type="submit"
                      disabled={loading}
                      onClick={handleSave}
                      className="bg-blue text-xs text-white py-2 px-4 rounded-md"
                    >
                      <LoadingButton text={"Simpan"} loading={loading} />
                    </button>
                  )}
                </>
              )}
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

      {modal1 && (
        <ActModal
          title={"Edit Profile"}
          isModalOpen={modal1}
          setIsModalOpen={() => setModal1(false)}
        >
          <form onSubmit={onSubmit}>
            <Input
              value={email}
              id={"email"}
              label={"Email"}
              type={"email"}
              placeholder={"Lengkapi email"}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />
            <Input
              value={whatsapp}
              id={"whatsapp"}
              type={"text"}
              maxlength={15}
              label={"Whatsapp"}
              placeholder={"Lengkapi whatsapp"}
              onChange={handleWhatsappChange}
              required={true}
            />
            <div className="flex justify-end">
              <button className=" bg-blue text-xs text-white py-2 px-4 rounded-md">
                <LoadingButton text={"Simpan"} loading={loading} />
              </button>
            </div>
          </form>
        </ActModal>
      )}
    </ContainerGlobal>
  );
};

export default MainProfile;
