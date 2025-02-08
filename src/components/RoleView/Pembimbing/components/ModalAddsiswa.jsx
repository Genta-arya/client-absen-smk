import React, { useState, useEffect } from "react";
import ActModal from "../../../../components/Modal/ActModal";
import { toast } from "sonner";
import Select from "react-select";
import { addSiswaToPkl } from "../../../../Api/Services/PKLServices";
import { FaPlus, FaTrashAlt } from "react-icons/fa"; // Menambahkan ikon hapus
import { BeatLoader } from "react-spinners";
import Input from "../../../Input";

const ModalAddsiswa = ({
  modalSiswa,
  setModalSiswa,
  loadingUser,
  userOptions,
  fetchData,
  data,
  setLoading,
}) => {
  const [shifts, setShifts] = useState([]); // State untuk daftar shift yang dipilih
  const [jamMasuk, setJamMasuk] = useState(""); // State untuk Jam Masuk
  const [jamKeluar, setJamKeluar] = useState(""); // State untuk Jam Keluar

  // Menambahkan shift pertama secara default saat modal dibuka
  useEffect(() => {
    if (modalSiswa) {
      setShifts([{ name: ``, jamMasuk: "", jamKeluar: "", users: [] }]);
    }
  }, [modalSiswa]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const shiftData = shifts.map((shift) => ({
        shift_name: shift.name,
        jam_masuk: shift.jamMasuk,
        jam_keluar: shift.jamKeluar,
        user_id: shift.users.map((user) => user.value), // Mengirimkan data user per shift
      }));

      // Menambahkan siswa dengan shift yang dipilih
      await addSiswaToPkl({
        pkl_id: data?.id,
        shift_data: shiftData, // Mengirimkan data shift yang lebih dinamis
      });

      setModalSiswa(false);
      window.location.reload();
      toast.success("Siswa berhasil ditambahkan", {});
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
      }
      toast.error("Gagal menambahkan siswa");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Menambah shift baru
  const addShift = () => {
    setShifts([...shifts, { name: ``, jamMasuk, jamKeluar, users: [] }]);
    setJamMasuk("");
    setJamKeluar("");
  };

  // Menghapus shift
  const removeShift = (index) => {
    const updatedShifts = [...shifts];
    updatedShifts.splice(index, 1); // Menghapus shift pada index yang dipilih
    setShifts(updatedShifts);
  };

  // Menghandle perubahan siswa per shift
  const handleUserChange = (selectedOptions, index) => {
    const updatedShifts = [...shifts];

    updatedShifts[index].users = selectedOptions;
    setShifts(updatedShifts);
  };

  // Fungsi untuk memfilter siswa yang sudah ada di shift
  const filterUserOptions = (shiftIndex) => {
    // Ambil semua user yang sudah dipilih di shift lain
    const allSelectedUsers = shifts
      .filter((shift, index) => index !== shiftIndex)
      .flatMap((shift) => shift.users)
      .map((user) => user.value);

    // Filter user yang sudah ada di shift lain
    return userOptions.filter((user) => !allSelectedUsers.includes(user.value));
  };

  return (
    <ActModal
      isModalOpen={modalSiswa}
      setIsModalOpen={setModalSiswa}
      title={"Tambah Siswa PKL"}
    >
      <div>
        <h1 className="text-center text-xs font-bold text-blue mb-1">
          "Hanya siswa yang belum memiliki PKL yang akan ditampilkan"
        </h1>
        <p className="text-xs mb-2 text-red-500">
          Jika PKL sudah dimulai maka siswa akan ketinggalan jadwal absensi
          tanggal sebelumnya.
        </p>
        <div className="text-xs">
          {loadingUser ? (
            <div className="flex items-center justify-center">
              <BeatLoader size={10} color="#294A70" />
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                {shifts.length == 1 && (
                  <>
                    <button
                      type="button"
                      onClick={addShift}
                      disabled={shifts.length >= 2} // Nonaktifkan tombol jika sudah 2 shift
                      className="bg-blue text-white py-2 rounded-md mt-2 text-center hover:opacity-80 transition"
                    >
                      Tambah Shift
                    </button>
                  </>
                )}

                {/* Daftar Shift yang sudah dipilih */}
                <div className="mt-2">
                  <ul>
                    {shifts.map((shift, index) => (
                      <li key={index} className="mt-3">
                        <Input
                          type="text"
                          id={`shiftName${index}`}
                          label={`Nama`}
                          placeholder={"Nama shift"}
                          value={shift.name}
                          onChange={(e) => {
                            const updatedShifts = [...shifts];
                            updatedShifts[index].name = e.target.value; // Mengubah nama shift
                            setShifts(updatedShifts);
                          }}
                        />
                        <Input
                          type="time"
                          id={`shiftJamMasuk${index}`}
                          label={`Jam Masuk`}
                          value={shift.jamMasuk}
                          required={true}
                          onChange={(e) => {
                            const updatedShifts = [...shifts];
                            updatedShifts[index].jamMasuk = e.target.value;

                            const jamMasuk = updatedShifts[index].jamMasuk;
                            const jamPulang = updatedShifts[index].jamKeluar;

                            // Validasi bahwa jam masuk tidak lebih besar dari jam pulang
                            if (jamMasuk && jamPulang && jamMasuk > jamPulang) {
                              toast.error(
                                "Jam masuk tidak boleh lebih besar dari jam pulang."
                              );
                              return;
                            }

                            setShifts(updatedShifts);
                          }}
                        />

                        <Input
                          type="time"
                          id={`shiftJamKeluar${index}`}
                          label={`Jam Keluar`}
                          value={shift.jamKeluar}
                          required={true}
                          onChange={(e) => {
                            const updatedShifts = [...shifts];
                            updatedShifts[index].jamKeluar = e.target.value;

                            const jamMasuk = updatedShifts[index].jamMasuk;
                            const jamPulang = updatedShifts[index].jamKeluar;

                            // Validasi bahwa jam keluar tidak lebih kecil dari jam masuk
                            if (jamMasuk && jamPulang && jamMasuk > jamPulang) {
                              toast.error(
                                "Jam keluar tidak boleh lebih kecil dari jam masuk."
                              );
                              return;
                            }

                            setShifts(updatedShifts);
                          }}
                        />

                        {/* Pilih User per Shift */}
                        <div className="form-group">
                          <label
                            htmlFor={`shiftUser${index}`}
                            className="text-xs font-bold mb-1"
                          >
                            Pilih Siswa untuk Shift {index + 1}
                          </label>
                          <Select
                            options={filterUserOptions(index)}
                            isMulti
                            required
                            placeholder="Cari Siswa..."
                            noOptionsMessage={() => "Tidak ada siswa"}
                            onChange={(selectedOptions) =>
                              handleUserChange(selectedOptions, index)
                            }
                            value={shift.users}
                            maxMenuHeight={200}
                          />
                        </div>

                        {/* Tombol Hapus Shift */}
                        {/* minimal punya 1 shift */}
                        {shifts.length > 1 && (
                          <div className="flex justify-center items-center">
                            <button
                              type="button"
                              onClick={() => removeShift(index)}
                              className="text-red-500 mt-2 flex justify-center items-center gap-1"
                            >
                              <FaTrashAlt /> Hapus Shift
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <button type="submit" className="flex justify-end mt-4">
                  <div className="bg-blue text-white py-2 rounded-md w-40 text-center hover:opacity-80 transition">
                    <div className="flex items-center gap-2 justify-center">
                      <FaPlus />
                      <p>Tambahkan</p>
                    </div>
                  </div>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </ActModal>
  );
};

export default ModalAddsiswa;
