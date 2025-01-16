import React, { useState } from "react";
import Button from "../../../components/Button";
import { FaPlus, FaSave } from "react-icons/fa";
import Search from "../../../components/Search";
import ActModal from "../../../components/Modal/ActModal";
import Input from "../../../components/Input";
import { ResponseHandler } from "../../../Utils/ResponseHandler";
import { HandleRegister } from "../../../Api/Services/LoginServices";
import { toast } from "sonner";
import Loading from "../../../components/Loading";

const Action = ({ searchTerm, setSearchTerm, placeholder, refresh }) => {
  const [modal, setModal] = useState(false);
  const [nama, setNama] = useState("");
  const [nisn, setNisn] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const onClose = () => {
    setModal(!modal);
    setNisn("");
    setNama("");
  };

  const handleSave = async () => {
    setLoading(true);
    try {
     await HandleRegister({
        nim: nisn,
        name: nama,
        password: nisn,
        role: role,
      });
      onClose();
      refresh();
      toast.success("Berhasil menambahkan Membuat akun.");
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex justify-between  gap-4">
      <Button
        icon={<FaPlus />}
        title={"Tambah Data"}
        type={"button"}
        style={"bg-blue"}
        onClick={() => setModal(true)}
      />
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder={placeholder}
      />
      {modal && (
        <ActModal
          isModalOpen={modal}
          setIsModalOpen={onClose}
          title={"Tambah Data"}
        >
          <form onSubmit={() => handleSave()}>
            <Input
              id={"nisn"}
              label={"Nisn"}
              onChange={(e) => setNisn(e.target.value)}
              minlength={1}
              required={true}
              placeholder={"Masukan NISN...."}
              type={"number"}
              value={nisn}
            />
            <Input
              id={"nama"}
              label={"Nama"}
              onChange={(e) => setNama(e.target.value)}
              minlength={1}
              required={true}
              placeholder={"Masukan Nama...."}
              type={"text"}
              value={nama}
            />
            <label htmlFor={"role"} className="block text-lg font-medium mb-2">
              Type akun
            </label>
            <select
              onChange={(e) => setRole(e.target.value)}
              required
              className=" mb-4 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none placeholder:text-xs   placeholder:text-gray-500 text-black"
            >
              <option value={""}>Silahkan pilih type</option>
              <option value={"pembimbing"}>Pembimbing</option>
              <option value={"user"}>Siswa</option>
            </select>
            <div className="flex justify-end">
              <Button
                icon={<FaSave />}
                title={"Simpan"}
                style={"bg-blue"}
                type={"submit"}
              />
            </div>
          </form>
        </ActModal>
      )}
    </div>
  );
};

export default Action;
