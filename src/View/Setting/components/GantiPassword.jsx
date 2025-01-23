import React, { useEffect } from "react";
import ContainerGlobal from "../../../components/ContainerGlobal";
import Input from "../../../components/Input";
import { FaLock, FaRegSave, FaSave } from "react-icons/fa";
import { ResponseHandler } from "../../../Utils/ResponseHandler";
import { updatePassowrd } from "../../../Api/Services/LoginServices";
import useAuthStore from "../../../Lib/Zustand/AuthStore";
import LoadingButton from "../../../components/LoadingButton";
import { toast } from "sonner";

const GantiPassword = () => {
  const [data, setData] = React.useState({
    password: "",
    new_password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      await updatePassowrd({
        password: data.password,
        new_password: data.new_password,
        id : user.id
      });
      toast.success("Password Berhasil diubah" );
      setData({
        password: "",
        new_password: "",
      })
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
    <ContainerGlobal>
      <h1 className="font-bold">
        <div className="flex gap-2 items-center">
          <FaLock /> <h1>Ganti Password</h1>
        </div>
      </h1>
      <form className="mt-8" onSubmit={handleSubmit}>
        <Input
          type="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          required={true}
          placeholder="Password Lama"
        />
        <Input
          type="password"
          value={data.new_password}
          minlength={6}
          onChange={(e) => setData({ ...data, new_password: e.target.value })}
          required={true}
          placeholder="Password Baru"
        />

        <button
          disabled={loading}
          className="bg-blue w-full hover:opacity-80  text-white font-bold py-1 px-4 rounded-md"
        >
          <LoadingButton loading={loading} icon={<FaSave />} text={"Simpan"} />
        </button>
      </form>
    </ContainerGlobal>
  );
};

export default GantiPassword;
