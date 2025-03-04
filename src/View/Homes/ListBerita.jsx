import React, { useEffect, useState } from "react";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import {
  EditBerita,
  EditStatusBerita,
  hapusBerita,
} from "../../Api/Services/BeritaServices";
import DOMPurify from "dompurify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Loading from "../../components/Loading";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";

import { toast } from "sonner";

import ActModal from "../../components/Modal/ActModal";

import LoadingButton from "../../components/LoadingButton";

import Editors from "../../components/Editor";

const ListBerita = ({
  berita,
  setBerita,
  fetchData,
  loading,
  setLoading,
  user,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalEdit, setModalEdit] = useState(false);
  const [selectData, setSelectData] = useState({
    id: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchData();
  }, []);
  const openEditModal = (item) => {
    setSelectData({
      id: item.id,
      title: item.title,
      content: item.content,
    });
    setModalEdit(true);
  };

  // Fungsi untuk menangani edit berita
  const handleEdit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    setLoading(true);
    try {
      await EditBerita({
        id: selectData.id,
        title: selectData.title,
        content: selectData.content,
      });

      fetchData(); // Refresh data setelah perubahan
      toast.success("Pengumuman berhasil diperbarui!");
      setModalEdit(false); // Tutup modal setelah berhasil edit
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleHapus = async (id) => {
    setLoading(true);
    try {
      await hapusBerita(id);
      fetchData();
      toast.success("Berita berhasil dihapus");
    } catch (error) {
      console.log(error);
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  const toggleArsip = async (id, status) => {
    setLoading(true);
    try {
      // Kirim request untuk mengubah status arsip (misal ke API)
      await EditStatusBerita({ id, status: !status }); // Fungsi API yang harus dibuat

      fetchData(); // Refresh data setelah perubahan status
      toast.success(`Berita ${status ? "diarsipkan" : "dipublikasikan"}!`);
    } catch (error) {
      console.log(error);
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loading />;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    const dayName = date.toLocaleDateString("id-ID", { weekday: "long" }); // Nama hari
    const day = date.getDate(); // Tanggal (1-31)
    const monthName = date.toLocaleDateString("id-ID", { month: "long" }); // Nama bulan
    const year = date.getFullYear(); // Tahun
  
    return `${dayName}, ${day} ${monthName} ${year}`;
  };
  
  return (
    <div className="mt-4 bg-gray-100 p-3 rounded-md">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full"
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {berita.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div className="  relative">
              {/* Tombol Edit */}

              {user?.role === "admin" && (
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.status}
                    onChange={() => toggleArsip(item.id, item.status)}
                    className="sr-only"
                  />
                  <div className="relative w-12 h-6 bg-gray-400 rounded-full transition duration-300">
                    <div
                      className={`absolute left-1 top-1 w-4 h-4  rounded-full transition ${
                        item.status ? "translate-x-6 bg-yellow-500" : "bg-white"
                      }`}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm">
                    {item.status ? "Aktif" : "Arsip"}
                  </span>
                </label>
              )}

              {user?.role === "admin" && (
                <div className="flex items-center gap-2 justify-end mb-8">
                  <button
                    onClick={() => openEditModal(item)}
                    className="bg-blue text-white w-20 items-center text-xs flex justify-center p-2 rounded px-4 hover:bg-blue transition"
                  >
                    <div className="flex items-center gap-2">
                      <FaEdit />
                      <p>Edit</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleHapus(item.id)}
                    className=" bg-red-500 text-xs text-white p-2  w-20 items-center flex justify-center rounded px-4  transition"
                  >
                    <div className="flex items-center gap-2">
                      <FaTrash />
                      <p>Hapus</p>
                    </div>
                  </button>
                </div>
              )}

              <p className="text-sm">
                {formatDate(item.createdAt)}
              </p>

              <h3 className="text-lg mb-4 text-blue pb-2 font-semibold border-dashed border-b border-gray-400">
                {item.title}
              </h3>
              <div
                className="mt-2 text-xs lg:text-sm md:text-sm text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(item.content),
                }}
              />

              {/* Custom Pagination */}
              <div className="custom-pagination">
                {berita.map((_, dotIndex) => (
                  <span
                    key={dotIndex}
                    className={`dot ${
                      activeIndex === dotIndex ? "active" : ""
                    }`}
                    onClick={() => setActiveIndex(dotIndex)}
                  />
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {modalEdit && (
        <ActModal
          height={"h-[65%] lg:h-[95%]"}
          isModalOpen={modalEdit}
          setIsModalOpen={setModalEdit}
          title={"Edit Pengumuman"}
        >
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            {/* Input untuk Judul Berita */}
            <input
              type="text"
              placeholder="Masukkan Judul"
              value={selectData.title}
              onChange={(e) =>
                setSelectData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border p-2 rounded-md w-full"
              required
            />

            {/* Editor untuk Konten Berita */}
            <Editors
              value={selectData.content}
              onChange={(e) =>
                setSelectData((prev) => ({ ...prev, content: e }))
              }
            />

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
          </form>
        </ActModal>
      )}
    </div>
  );
};

export default ListBerita;
