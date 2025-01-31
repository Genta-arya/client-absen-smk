import React, { useEffect } from "react";
import ContainerGlobal from "../../../ContainerGlobal";
import { FaPlus, FaSave, FaWarehouse } from "react-icons/fa";
import Input from "../../../Input";
import Select from "react-select";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import { createPKL } from "../../../../Api/Services/PKLServices";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";
import LoadingButton from "../../../LoadingButton";
import useUser from "../../../../Lib/Hook/useUser";

const CreatePKL = () => {
  const { user } = useAuthStore();
  const [data, setData] = React.useState({
    name: "",
    address: "",
    start_date: "",
    end_date: "",
    creatorId: user?.id,
    shifts: [
      {
        name: "",
        jamMasuk: "",
        jamPulang: "",
        users: [],
      },
    ],
  });

  const { userOptions, loading, getDataUsers } = useUser();
  const [loading1, setLoading1] = React.useState(false);

  useEffect(() => {
    getDataUsers();
  }, []);

  const handleShiftChange = (index, field, value) => {
    const updatedShifts = [...data.shifts];
    updatedShifts[index][field] = value;

    // Validasi jam masuk tidak boleh lebih besar dari jam pulang
    if (field === "jamMasuk" || field === "jamPulang") {
      const jamMasuk = updatedShifts[index].jamMasuk;
      const jamPulang = updatedShifts[index].jamPulang;
      if (jamMasuk && jamPulang && jamMasuk > jamPulang) {
        toast.error("Jam masuk tidak boleh lebih besar dari jam pulang.");
        return;
      }
    }

    setData({ ...data, shifts: updatedShifts });
  };

  const handleAddShift = () => {
    setData({
      ...data,
      shifts: [
        ...data.shifts,
        { name: "", jamMasuk: "", jamPulang: "", users: [] },
      ],
    });
  };

  const handleRemoveShift = (index) => {
    if (data.shifts.length === 1) {
      return toast.info("Minimal harus memiliki 1 shift.");
    }
    const updatedShifts = [...data.shifts];
    updatedShifts.splice(index, 1);
    setData({ ...data, shifts: updatedShifts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading1(true);

    try {
      const formattedData = {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        shifts: data.shifts.map((shift) => ({
          ...shift,
          jamMasuk: new Date(
            `${data.start_date}T${shift.jamMasuk}:00`
          ).toISOString(),
          jamPulang: new Date(
            `${data.start_date}T${shift.jamPulang}:00`
          ).toISOString(),
          users: shift.users.map((user) => user.value),
        })),
      };
      await createPKL(formattedData);
      toast.success("Berhasil membuat PKL.");
      setData({
        name: "",
        address: "",
        start_date: "",
        end_date: "",
        creatorId: user?.id,
        shifts: [{ name: "", jamMasuk: "", jamPulang: "", users: [] }],
      });
      getDataUsers();
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
      }
      ResponseHandler(error.response);
      toast.error("Gagal membuat PKL.");
    } finally {
      setLoading1(false);
    }
  };

  const getAvailableUsers = (index) => {
    const usedUsers = data.shifts
      .filter((_, i) => i !== index)
      .flatMap((shift) => shift.users.map((user) => user.value));
    return userOptions.filter((option) => !usedUsers.includes(option.value));
  };

  return (
    <div className="pb-20">
      <ContainerGlobal>
        <div className="flex gap-2 items-center border border-dashed p-4 justify-center">
          <FaWarehouse />
          <h1 className="text-lg font-extrabold">Tambah Tempat PKL</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex-col flex gap-4 pb-4">
          <Input
            type="text"
            label="Nama Tempat PKL"
            maxlength={50}
            required={true}
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Nama Tempat PKL"
          />
          <Input
            type="text"
            label="Alamat Tempat PKL"
            maxlength={150}
            required={true}
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            placeholder="Alamat Tempat PKL"
          />
          <h1 className="text-sm text-red-500 text-center border rounded-md mb-4 py-4">
            "Pastikan Tanggal Mulai dan selesai sesuai dengan data yang
            dibutuhkan, karena data tanggal tidak bisa diubah lagi."
          </h1>
          <Input
            type="date"
            label="Tanggal Mulai PKL"
            required={true}
            value={data.start_date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setData({ ...data, start_date: e.target.value })}
          />
          <Input
            type="date"
            label="Tanggal Selesai PKL"
            required={true}
            value={data.end_date}
            min={data.start_date}
            onChange={(e) => setData({ ...data, end_date: e.target.value })}
          />

          <h1 className="text-sm text-red-500 text-center border rounded-md mb-4 py-4">
            "Pastikan Jam masuk dan jam pulang sesuai dengan data yang
            dibutuhkan, karena data tidak bisa diubah lagi."
          </h1>

          {data.shifts.map((shift, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 mb-4 p-4 border rounded-md"
            >
              <Input
                type="text"
                placeholder="Nama Shift"
                required={true}
                value={shift.name}
                onChange={(e) =>
                  handleShiftChange(index, "name", e.target.value)
                }
              />
              <Input
                type="time"
                label="Jam Masuk"
                placeholder="Jam Masuk"
                required={true}
                value={shift.jamMasuk}
                onChange={(e) =>
                  handleShiftChange(index, "jamMasuk", e.target.value)
                }
              />
              <Input
                type="time"
                label="Jam Pulang"
                placeholder="Jam Pulang"
                required={true}
                value={shift.jamPulang}
                onChange={(e) =>
                  handleShiftChange(index, "jamPulang", e.target.value)
                }
              />
              <div>
                <label className="block text-sm font-medium mb-2">
                  Pilih Siswa
                </label>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <BeatLoader size={10} color="#294A70" />
                  </div>
                ) : (
                  <Select
                    options={getAvailableUsers(index)}
                    isMulti
                    placeholder="Pilih siswa..."
                    value={shift.users}
                    required
                    onChange={(selectedUsers) =>
                      handleShiftChange(index, "users", selectedUsers)
                    }
                  />
                )}
              </div>
              {/* jika shift hanya 1 maka jangan tampilkan button */}
              {data.shifts.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveShift(index)}
                  className="text-red-500 text-sm mt-2"
                >
                  Hapus Shift
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddShift}
            className="border-blue border text-blue text-sm hover:opacity-90 py-2 px-4 rounded-lg mb-0"
          >
            <div className="flex items-center justify-center gap-1">
              <FaPlus />
              Tambah Shift
            </div>
          </button>

          <button
            type="submit"
            disabled={loading1}
            className="bg-blue text-sm hover:opacity-90 text-white py-2 px-4 rounded-lg"
          >
            <LoadingButton icon={<FaSave />} text="Simpan" loading={loading1} />
          </button>
        </form>
      </ContainerGlobal>
    </div>
  );
};

export default CreatePKL;
