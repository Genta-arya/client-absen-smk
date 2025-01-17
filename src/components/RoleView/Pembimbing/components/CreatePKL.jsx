import React, { useEffect } from "react";
import ContainerGlobal from "../../../ContainerGlobal";
import { FaWarehouse } from "react-icons/fa";
import Input from "../../../Input";
import Select from "react-select";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import { getDataUser } from "../../../../Api/Services/LoginServices";
import Loading from "../../../Loading";
import { createPKL } from "../../../../Api/Services/PKLServices";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

const CreatePKL = () => {
  const { user } = useAuthStore();
  const [data, setData] = React.useState({
    name: "",
    address: "",
    user_id: [],
    start_date: "",
    end_date: "",
    creatorId: user?.id,
  });

  const [userOptions, setUserOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const getDataUsers = async () => {
    setLoading(true);
    try {
      const response = await getDataUser("user");

      const users = response.data;
      // ambil user yang belum ada PKL
      const filteredUsers = users.filter((user) => {
        return user.Pkl.length === 0;
      });

      const options = filteredUsers.map((user) => ({
        value: user.id,
        label: user.name,
      }));

      setUserOptions(options);
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        user_id: data.user_id.map((user) => user.value),
      };

      await createPKL(formattedData);
      toast.success("Berhasil membuat PKL.");
      setData({
        name: "",
        address: "",
        user_id: [],
        start_date: "",
        end_date: "",
        creatorId: user?.id,
      });
    } catch (error) {
      ResponseHandler(error.response);
    }
  };

  return (
    <ContainerGlobal>
      <div className="flex gap-2 items-center border border-dashed p-4 justify-center">
        <FaWarehouse />
        <h1 className="text-lg font-extrabold">Tambah Tempat PKL</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex-col flex gap-4">
        <Input
          type="text"
          label="Nama Tempat PKL"
          maxlength={50}
          required={true}
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder={"Nama Tempat PKL"}
        />
        <Input
          type="text"
          label="Alamat Tempat PKL"
          maxlength={150}
          required={true}
          value={data.address}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          placeholder={"Alamat Tempat PKL"}
        />
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
          onChange={(e) => setData({ ...data, end_date: e.target.value })}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Pilih Siswa</label>
          <p className="text-xs text-gray-500 mb-1">
            * Hanya menampilkan siswa yang belum memiliki PKL
          </p>
          {loading ? (
            <div className="flex items-center justify-center">
              <BeatLoader size={10} color="#294A70" />
            </div>
          ) : (
            <>
              <Select
                options={userOptions}
                isMulti
                placeholder="Cari Siswa..."
                required
                noOptionsMessage={() => "Tidak ada siswa"}
                onChange={(selectedOptions) =>
                  setData({ ...data, user_id: selectedOptions })
                }
              />
            </>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue text-sm hover:opacity-90 text-white py-2 px-4 rounded-lg"
        >
          Simpan
        </button>
      </form>
    </ContainerGlobal>
  );
};

export default CreatePKL;
