import React, { useState } from "react";
import ContainerLayout from "../../components/ContainerLayout";
import {
  FaExclamationCircle,
  FaExclamationTriangle,
  FaPlus,
  FaSave,
  FaTag,
} from "react-icons/fa";
import useAuthStore from "../../Lib/Zustand/AuthStore";
import ActModal from "../../components/Modal/ActModal";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "sonner";

import { createBerita, getBerita } from "../../Api/Services/BeritaServices";
import LoadingButton from "../../components/LoadingButton";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import ListBerita from "./ListBerita";

import { BeatLoader } from "react-spinners";
import Editors from "../../components/Editor";

const MainPengumuman = () => {
  const { user } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [berita, setBerita] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getBerita(user?.role);

      setBerita(response.data);
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.length <= 5) {
      toast.info("Konten berita minimal 5 karakter.");
    }
    if (title.length <= 5) {
      toast.info("Judul berita minimal 5 karakter.");
    }
    setLoading(true);
    try {
      await createBerita({
        title: title,
        content: content,
      });
      toast.success("Berita berhasil ditambahkan");
      window.location.reload();
      setModalOpen(false);
      setContent("");
      setTitle("");
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {user?.role !== "user" ? (
        <ContainerLayout>
          <div className="bg-white shadow-lg rounded-md mt-4 px-4 py-4 pt-4">
            <div className="flex justify-between ">
              <div className="flex  text-xl items-center gap-2 font-bold text-blue">
                <FaExclamationCircle className="text-2xl" />
                <p className="text-black text-base font-bold">
                  Pengumuman ({berita.length})
                </p>
              </div>
              {user?.role === "admin" && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setModalOpen(true)}>
                    <div className="flex items-center gap-2 border px-2 py-1 rounded-md border-gray-500">
                      <FaPlus />
                      <p>Tulis</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <ListBerita
              berita={berita}
              user={user}
              fetchData={fetchData}
              setBerita={setBerita}
              loading={loading}
              setLoading={setLoading}
            />

            {modalOpen && (
              <ActModal
                height={"h-[65%] lg:h-[95%]"}
                isModalOpen={modalOpen}
                setIsModalOpen={setModalOpen}
                title={"Tulis Pengumuman"}
              >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Input untuk Judul Berita */}
                  <input
                    type="text"
                    placeholder="Masukkan Judul"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded-md w-full"
                    required
                  />

                  {/* Editor untuk Konten Berita */}

                  <Editors value={content} onChange={(e) => setContent(e)} />

                  {/* Tombol Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue text-white p-2 rounded-md hover:bg-blue-700"
                  >
                    <LoadingButton
                      icon={<FaSave />}
                      text={"Simpan"}
                      loading={loading}
                    />
                  </button>
                  <p className="text-center font-bold  text-red-500 text-xs">
                    "Maksimal hanya 5 Pengumuman"
                  </p>
                </form>
              </ActModal>
            )}
          </div>
        </ContainerLayout>
      ) : (
        <>
          <div className="bg-white shadow-lg rounded-md mt-4 px-4 py-4 pt-4">
            <div className="flex justify-between ">
              <div className="flex  text-xl items-center gap-2 font-bold text-blue">
                <FaExclamationCircle className="text-2xl" />
                <p className="text-black text-base font-bold">
                  Pengumuman ({berita.length})
                </p>
              </div>
              {user?.role === "admin" && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setModalOpen(true)}>
                    <div className="flex items-center gap-2 border px-2 py-1 rounded-md border-gray-500">
                      <FaPlus />
                      <p>Tulis Pengumuman</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <ListBerita
              berita={berita}
              user={user}
              fetchData={fetchData}
              setBerita={setBerita}
              loading={loading}
              setLoading={setLoading}
            />

            {modalOpen && (
              <ActModal
                height={"h-[65%] lg:h-[95%]"}
                isModalOpen={modalOpen}
                setIsModalOpen={setModalOpen}
                title={"Tulis Pengumuman"}
              >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Input untuk Judul Berita */}
                  <input
                    type="text"
                    placeholder="Masukkan Judul"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded-md w-full"
                    required
                  />

                  {/* Editor untuk Konten Berita */}

                  <Editors value={content} onChange={(e) => setContent(e)} />

                  {/* Tombol Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue text-white p-2 rounded-md hover:bg-blue-700"
                  >
                    <LoadingButton
                      icon={<FaSave />}
                      text={"Simpan"}
                      loading={loading}
                    />
                  </button>
                  <p className="text-center font-bold  text-red-500 text-xs">
                    "Maksimal hanya 5 Pengumuman"
                  </p>
                </form>
              </ActModal>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MainPengumuman;
