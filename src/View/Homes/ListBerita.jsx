import React, { useEffect, useState } from "react";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import { getBerita } from "../../Api/Services/BeritaServices";
import DOMPurify from "dompurify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Loading from "../../components/Loading";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";

const ListBerita = () => {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getBerita();
        setBerita(response.data);
      } catch (error) {
        ResponseHandler(error.response);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk menangani edit berita
  const handleEdit = (id) => {
    console.log(`Edit berita dengan ID: ${id}`);
    // Bisa dikembangkan untuk membuka modal atau redirect ke halaman edit
  };

  return (
    <div className="mt-8">
      {loading ? (
        <Loading />
      ) : berita.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">
          Tidak ada berita tersedia.
        </p>
      ) : (
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
              <div className="border p-4 rounded-md shadow-md min-h-screen bg-white relative">
                {/* Tombol Edit */}

                <div className="flex items-center gap-2 justify-end mb-8">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className=" bg-blue text-white w-20 items-center flex justify-center p-2 rounded px-4 hover:bg-blue transition"
                  >
                    <div className="flex items-center gap-2">
                      <FaEdit />
                      <p>Edit</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className=" bg-blue text-xs text-white p-2 w-20 items-center flex justify-center rounded px-4 hover:bg-blue transition"
                  >
                    <div className="flex items-center gap-2">
                      <FaTrash />
                      <p>Hapus</p>
                    </div>
                  </button>
                </div>

                <h3 className="text-lg font-semibold border-dashed border-b border-gray-400">
                  {item.title}
                </h3>
                <div
                  className="mt-2 text-gray-700"
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
      )}
    </div>
  );
};

export default ListBerita;
