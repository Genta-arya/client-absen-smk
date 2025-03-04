import React, { useState } from "react";
import ContainerLayout from "../../components/ContainerLayout";
import { FaPlus, FaSave, FaTag } from "react-icons/fa";
import useAuthStore from "../../Lib/Zustand/AuthStore";
import ActModal from "../../components/Modal/ActModal";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "sonner";
import { s } from "framer-motion/m";
import { createBerita } from "../../Api/Services/BeritaServices";
import LoadingButton from "../../components/LoadingButton";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import ListBerita from "./ListBerita";

const MainPengumuman = () => {
  const { user } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.length <= 5) {
      toast.info("Konten berita minimal 5 karakter.");
    }
    if (title.length <= 5) {
      toast.info("Judul berita minimal 5 karakter.");
    }
    try {
      setLoading(true);
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

    // Tambahkan logika untuk mengirim data ke backend di sini

    // Tutup modal setelah submit
  };

  return (
    <ContainerLayout>
      <div className="flex justify-between">
        <div className="flex  text-xl items-center gap-2 font-bold text-blue">
          <FaTag />
          <p>Berita</p>
        </div>
        {user?.role === "admin" && (
          <div className="flex items-center gap-2">
            <button onClick={() => setModalOpen(true)}>
              <div className="flex items-center gap-2 border px-2 py-1 rounded-md border-gray-500">
                <FaPlus />
                <p>Tulis Berita</p>
              </div>
            </button>
          </div>
        )}
      </div>


      <ListBerita />

      {modalOpen && (
        <ActModal
          height={"h-[65%] lg:h-[95%]"}
          isModalOpen={modalOpen}
          setIsModalOpen={setModalOpen}
          title={"Tulis Berita"}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Input untuk Judul Berita */}
            <input
              type="text"
              placeholder="Masukkan Judul Berita"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded-md w-full"
              required
            />

            {/* Editor untuk Konten Berita */}
            <Editor
              apiKey="gne0tu6k3iyh6uv3gc01ui2l980ve69xi0h7iwelw6sf2uvg"
              init={{
                height: 300,
                menubar: true,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                  "image",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help | image",
              }}
              value={content}
              onEditorChange={(newContent) => setContent(newContent)}
            />

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue text-white p-2 rounded-md hover:bg-blue-700"
            >
              <LoadingButton
                icon={<FaSave />}
                text={"Simpan Berita"}
                loading={loading}
              />
            </button>
          </form>
        </ActModal>
      )}
    </ContainerLayout>
  );
};

export default MainPengumuman;
