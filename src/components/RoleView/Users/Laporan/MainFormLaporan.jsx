import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ContainerGlobal from "../../../ContainerGlobal";
import {
  deleteFotoById,
  getSingleLaporan,
  uploadLaporanHarina,
} from "../../../../Api/Services/LaporanServices";
import { uploadProfile } from "../../../../Api/Services/LoginServices";
import Loading from "../../../Loading";
import NotfoundData from "../../../NotfoundData";
import { toast } from "sonner";
import { ScaleLoader } from "react-spinners";
import { FaPrint, FaSave, FaTag } from "react-icons/fa";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";

const MainFormLaporan = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [laporan, setLaporan] = useState({
    pembimbingId: "",
    nama_instruktur: "",
    pelaksanaan_kegiatan: "",
    catatan_instruktur: "",
    nama_pekerjaan: "",
    perencanaan_kegiatan: "",
    nama_pembimbing: "",
    tanggal: "",
    status_selesai: "",
    fotos: [],
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // Untuk menyimpan file yang dipilih sebelum diupload

  const fetchLaporan = async () => {
    try {
      const response = await getSingleLaporan(id);
      setLaporan(response.data);
    } catch (error) {
      console.error("Error fetching laporan:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLaporan();
  }, [id]);

  console.log("Data laporan:", laporan);

  // Menyimpan file yang dipilih
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (laporan.fotos.length + files.length + selectedFiles.length > 3) {
      event.preventDefault(); // Mencegah event jika jumlah file melebihi 3
      toast.info("Maksimal 3 foto yang dapat diunggah.");
      //   saya mau kembalikan tulisan  no file choose
      event.target.value = null;

      return;
    }

    if (files.some((file) => file.size > 2 * 1024 * 1024)) {
      event.preventDefault(); // Mencegah event jika ukuran file terlalu besar
      event.target.value = null;
      toast.info("Ukuran gambar terlalu besar, maksimal 2MB.");
      setSelectedFiles([]);
      return;
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...files]); // Menambahkan file baru ke selectedFiles
  };

  const handleRemovePreviewImage = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);

    let uploadedFotos = []; // Default kosong jika tidak ada foto

    // Jika ada foto yang dipilih, lakukan upload
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("file[]", file);
      });

      try {
        const response = await uploadProfile(formData);
        console.log("Response dari server:", response);

        if (response?.data?.files) {
          uploadedFotos = response.data.files.map((file) => ({
            id: Date.now(), // ID unik sementara
            foto_url: file.file_url,
          }));
        }
      } catch (error) {
        console.error("Gagal mengunggah gambar:", error);
        setUploading(false);
        return; // Jika upload foto gagal, hentikan proses
      }
    }

    try {
      setLoading(true);

      await uploadLaporanHarina({
        ...laporan,
        fotos: [...(laporan.fotos || []), ...uploadedFotos],
      });

      fetchLaporan();
      setSelectedFiles([]);
      toast.success("Laporan berhasil diunggah!");
    } catch (error) {
      console.error("Gagal mengunggah laporan:", error);
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleDeleteFoto = async (fotoId) => {
    if (laporan.fotos.length === 1) {
      toast.info("Tidak dapat menghapus foto. Minimal tersisa 1  foto.");
      return;
    }
    setLoading(true);

    try {
      await deleteFotoById(fotoId);

      setLaporan((prevLaporan) => ({
        ...prevLaporan,
        fotos: prevLaporan.fotos.filter((foto) => foto.id !== fotoId),
      }));

      toast.success("Foto berhasil dihapus!");
      fetchLaporan();
    } catch (error) {
      console.error("Gagal menghapus foto:", error);
      toast.error("Gagal menghapus foto.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ContainerGlobal>
      <div className="">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <FaTag className="text-blue text-xl" />
            <h1 className="text-2xl font-bold text-blue ">Jurnal Harian</h1>
          </div>
        </div>
        {!laporan.pembimbingId ? (
          <NotfoundData />
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nama Instruktur & Pembimbing */}
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Nama Instruktur
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={laporan.nama_instruktur}
                  onChange={(e) =>
                    setLaporan({ ...laporan, nama_instruktur: e.target.value })
                  }
                  required
                  disabled={user?.role !== "user"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Nama Pembimbing
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={laporan.nama_pembimbing}
                  onChange={(e) =>
                    setLaporan({ ...laporan, nama_pembimbing: e.target.value })
                  }
                  disabled
                  required
                />
              </div>
            </div>

            {/* Nama Pekerjaan & Tanggal */}
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Nama Pekerjaan
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={laporan.nama_pekerjaan}
                  onChange={(e) =>
                    setLaporan({ ...laporan, nama_pekerjaan: e.target.value })
                  }
                  required
                  disabled={user?.role !== "user"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tanggal</label>
                <input
                  type="date"
                  className="w-full border rounded p-2"
                  value={laporan.tanggal.split("T")[0]}
                  disabled
                />
              </div>
            </div>

            {/* Perencanaan Kegiatan */}
            <div>
              <label className="block text-sm font-medium">
                Perencanaan Kegiatan
              </label>
              <textarea
                className="w-full border rounded p-2"
                value={laporan.perencanaan_kegiatan}
                onChange={(e) =>
                  setLaporan({
                    ...laporan,
                    perencanaan_kegiatan: e.target.value,
                  })
                }
                required
                disabled={user?.role !== "user"}
              />
            </div>

            {/* Pelaksanaan Kegiatan */}
            <div>
              <label className="block text-sm font-medium">
                Pelaksanaan Kegiatan
              </label>
              <textarea
                className="w-full border rounded p-2"
                value={laporan.pelaksanaan_kegiatan}
                onChange={(e) =>
                  setLaporan({
                    ...laporan,
                    pelaksanaan_kegiatan: e.target.value,
                  })
                }
                required
                disabled={user?.role !== "user"}
              />
            </div>

            {/* Catatan Instruktur */}
            <div>
              <label className="block text-sm font-medium">
                Catatan Instruktur
              </label>
              <textarea
                className="w-full border rounded p-2"
                value={laporan.catatan_instruktur}
                onChange={(e) =>
                  setLaporan({ ...laporan, catatan_instruktur: e.target.value })
                }
                required
                disabled={user?.role !== "user"}
              />
            </div>

            <div>
              {user?.role === "user" && (
                <>
                  <label className="block text-sm font-medium">
                    Upload Foto (Maksimal 3 & 2MB){" "}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={laporan.fotos.length === 0}
                    className="w-full border p-2 rounded"
                    multiple
                  />
                </>
              )}

              {uploading ? (
                <div className="flex justify-center items-center mt-4">
                  <ScaleLoader className="text-blue text-2xl" />
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2  gap-4 mt-4">
                  {laporan.fotos.map((foto, index) => (
                    <div key={`uploaded-${index}`} className="relative">
                      <img
                        src={foto.foto_url}
                        alt="Uploaded"
                        loading="lazy"
                        onClick={() => window.open(foto.foto_url, "_blank")}
                        className="w-full cursor-pointer h-52 lg:h-[80%] md:h-[80%] object-cover rounded border"
                      />
                      {user?.role === "user" && (
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
                          onClick={() => handleDeleteFoto(foto.id)}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  ))}

                  {selectedFiles.map((file, index) => (
                    <div key={`selected-${index}`} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        loading="lazy"
                        className="w-full h-52 lg:h-[80%] md:h-[80%] object-cover rounded border"
                      />
                      {user?.role === "user" && (
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
                          onClick={() => handleRemovePreviewImage(index)}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Jika tidak ada foto sama sekali */}
                  {laporan.fotos.length === 0 && selectedFiles.length === 0 && (
                    <p className="col-span-3 text-center text-gray-500">
                      Belum ada foto yang diunggah
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Tombol Submit */}
            {user?.role === "user" && (
              <button
                disabled={loading || uploading || !user?.Pkl?.[0]?.status} // Disable jika status PKL false atau undefined
                type="submit"
                className={`w-full px-4 py-2 text-sm rounded-md flex items-center justify-center gap-2 
      ${
        loading || uploading || !user?.Pkl?.[0]?.status
          ? "bg-gray-400 text-white cursor-not-allowed" // Ubah warna saat disabled
          : "bg-blue text-white hover:opacity-85"
      }`}
              >
                <FaSave />
                <p>{loading ? "Menyimpan..." : "Simpan Jurnal"}</p>
              </button>
            )}

            {user?.Pkl?.[0]?.status === false && (
              <p className="text-red-500 text-xs text-center ">
                Praktik Kerja Lapangan Telah Berakhir
              </p>
            )}
          </form>
        )}
        {user?.role === "user" && (
          <Link
            to={`/app/cetak/laporan/harian/${laporan.id}`}
            className="flex items-center gap-2 justify-center mt-2 border py-2 rounded-md hover:cursor-pointer"
          >
            <FaPrint className="text-blue text-xl" />
            <h1 className="text-xs font-bold text-blue ">
              Cetak Jurnal Harian
            </h1>
          </Link>
        )}
      </div>
    </ContainerGlobal>
  );
};

export default MainFormLaporan;
