import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ContainerGlobal from "../../../ContainerGlobal";
import { getSingleLaporan } from "../../../../Api/Services/LaporanServices";
import { uploadProfile } from "../../../../Api/Services/LoginServices";

const MainFormLaporan = () => {
  const { id } = useParams();
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

  useEffect(() => {
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

    fetchLaporan();
  }, [id]);

  // Menyimpan file yang dipilih
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (laporan.fotos.length + files.length + selectedFiles.length > 3) {
      event.preventDefault(); // Mencegah event jika jumlah file melebihi 3
      alert("Maksimal 3 foto yang dapat diunggah.");
    //   saya mau kembalikan tulisan  no file choose
    event.target.value = null;
      
      return;
    }
  
    if (files.some((file) => file.size > 2 * 1024 * 1024)) {
      event.preventDefault(); // Mencegah event jika ukuran file terlalu besar
      event.target.value = null;
      alert("Ukuran gambar terlalu besar, maksimal 2MB.");
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
  
    // Membuat FormData untuk semua file
    const formData = new FormData();
  
    // Menambahkan semua file ke dalam FormData
    selectedFiles.forEach((file) => {
      formData.append("file[]", file); // Menambahkan file dalam array "file[]"
    });
  
    try {
      // Mengirim FormData ke endpoint upload
      const response = await uploadProfile(formData);
  
      // Jika berhasil, ambil URL foto yang diupload
      if (response?.data?.foto_url) {
        const uploadedFotos = response.data.foto_url.map((fotoUrl) => ({
          id: Date.now(), // Anda bisa menggunakan ID unik jika ingin
          foto_url: fotoUrl,
        }));
  
        // Gabungkan dengan foto yang sudah ada
        setLaporan((prev) => ({
          ...prev,
          fotos: [...prev.fotos, ...uploadedFotos],
        }));
      }
    } catch (error) {
      console.error("Gagal mengunggah gambar:", error);
    }
  
    setUploading(false);
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <ContainerGlobal>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Laporan Kegiatan PKL</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nama Instruktur & Pembimbing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nama Instruktur</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={laporan.nama_instruktur}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Nama Pembimbing</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={laporan.nama_pembimbing}
                required
              />
            </div>
          </div>

          {/* Nama Pekerjaan & Tanggal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nama Pekerjaan</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={laporan.nama_pekerjaan}
                required
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
            <label className="block text-sm font-medium">Perencanaan Kegiatan</label>
            <textarea
              className="w-full border rounded p-2"
              value={laporan.perencanaan_kegiatan}
              required
            />
          </div>

          {/* Pelaksanaan Kegiatan */}
          <div>
            <label className="block text-sm font-medium">Pelaksanaan Kegiatan</label>
            <textarea
              className="w-full border rounded p-2"
              value={laporan.pelaksanaan_kegiatan}
              required
            />
          </div>

          {/* Catatan Instruktur */}
          <div>
            <label className="block text-sm font-medium">Catatan Instruktur</label>
            <textarea
              className="w-full border rounded p-2"
              value={laporan.catatan_instruktur}
              required
            />
          </div>

          {/* Upload & Preview Gambar (3 Kolom) */}
          <div>
            <label className="block text-sm font-medium">Upload Foto (Maksimal 3 & 2MB) </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
              multiple
            />

            {uploading && <p className="text-sm text-gray-500">Mengunggah gambar...</p>}

            <div className="grid grid-cols-3 gap-4 mt-4">
              {/* Preview Gambar yang dipilih */}
              {selectedFiles.length > 0 ? (
                selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-32 md:h-32 lg:h-96 object-cover rounded border"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
                      onClick={() => handleRemovePreviewImage(index)}
                    >
                      Hapus
                    </button>
                  </div>
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500">Belum ada foto</p>
              )}
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="bg-blue w-full text-white px-4 py-2 rounded-md hover:opacity-85"
          >
            Simpan Laporan
          </button>
        </form>
      </div>
    </ContainerGlobal>
  );
};

export default MainFormLaporan;
