import React, { useEffect } from "react";
import ContainerGlobal from "../../../ContainerGlobal";
import { FaSave, FaWarehouse } from "react-icons/fa";
import Input from "../../../Input";

import { ResponseHandler } from "../../../../Utils/ResponseHandler";

import { toast } from "sonner";
import { updatePkl } from "../../../../Api/Services/PKLServices";
import LoadingButton from "../../../LoadingButton";

const EditPkl = ({ datas, setStatusEdit, refresh }) => {
  const [data, setData] = React.useState({
    name: "",
    address: "",
    grupUrl: "",
    id: datas.id,
  });



  useEffect(() => {
    setData({
      name: datas.name,
      address: datas.alamat,
      id: datas.id,
      grupUrl: datas.link_grup,
    });
  }, [datas]);

  const [loading, setLoading] = React.useState(false);
  console.log(data);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await updatePkl({
        ...data,
      });

    
      toast.success("Data PKL Berhasil diubah");
      setData({
        name: response.data.name,
        address: response.data.alamat,
        id: response.data.id,
        grupUrl: response.data.link_grup,
      });
      refresh();
      setStatusEdit(false);
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
    <ContainerGlobal visible={true}>
      <div className="flex gap-2 items-center border border-dashed p-4 justify-center">
        <FaWarehouse />
        <h1 className="text-lg font-extrabold">Edit Data PKL</h1>
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
          type="url"
          label="Grup Whatsapp"
          required={true}
          value={data.grupUrl}
          onChange={(e) => setData({ ...data, grupUrl: e.target.value })}
          placeholder={"https://grupwhatsapp.example.com"}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue text-sm hover:opacity-90 text-white py-2 px-4 rounded-lg"
        >
          <LoadingButton icon={<FaSave />} text={"Simpan"} loading={loading} />
        </button>
      </form>
      <button
        onClick={() => setStatusEdit(false)}
        className="border-blue border text-sm w-full mt-2 hover:opacity-70 text-black py-2 px-4 rounded-lg"
      >
        Kembali
      </button>
    </ContainerGlobal>
  );
};

export default EditPkl;
