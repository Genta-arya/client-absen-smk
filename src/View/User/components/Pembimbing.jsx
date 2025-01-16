import React from "react";
import Table from "../../../components/Table/Table";
import Thead from "../../../components/Table/Thead";
import Tbody from "../../../components/Table/Tbody";
import Th from "../../../components/Table/Th";
import Td from "../../../components/Table/Td";
import Button from "../../../components/Button";
import { FaLockOpen, FaPlus } from "react-icons/fa";
import Search from "../../../components/Search";

import ActModal from "../../../components/Modal/ActModal";
import Input from "../../../components/Input";
import { ResponseHandler } from "../../../Utils/ResponseHandler";
import { ForgotPassword } from "../../../Api/Services/LoginServices";
import useUser from "../../../Lib/Hook/useUser";
import Loading from "../../../components/Loading";

const Pembimbing = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [selectData, setSelectData] = React.useState(null);
  const { data: dataSiswa, loading, updatePasswords, fetchData } = useUser();
  const SearchFilter = (dataSiswa, searchTerm) => {
    return dataSiswa.filter((siswa) => {
      return (
        siswa?.nim
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        siswa?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const handleEdit = (data) => {
    setSelectData(data);
    setModalOpen(true);
  };

  const onClose = () => {
    setModalOpen(false);
    setPassword("");
  };

  const handlePasswordChange = async () => {
    try {
      await updatePasswords(selectData.id, password);
      onClose();
      fetchData();
    } catch (error) {
      ResponseHandler(error.response);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between  gap-4">
        <Button
          icon={<FaPlus />}
          title={"Tambah Data"}
          type={"button"}
          style={"bg-blue"}
          onClick={() => {}}
        />
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={"Cari Pembimbing"}
        />
      </div>
      <Table>
        <Thead>
          <tr>
            <Th text={"No"} />
            <Th text={"NIP"} />
            <Th text={"Nama"} />
            <Th text={"Aksi"} />
          </tr>
        </Thead>
        <Tbody>
          {SearchFilter(dataSiswa, searchTerm).map((siswa, index) => (
            <>
              <tr key={siswa.id}>
                <Td text={index + 1} />
                <Td text={siswa.nim} />
                <Td text={siswa.nama || "-"} />

                <td className="border p-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(siswa)}
                    className="bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:opacity-85 transition-all  ease-in-out"
                  >
                    <div className="flex gap-2 items-center">
                      <FaLockOpen />
                      <p>Ganti Password</p>
                    </div>
                  </button>
                </td>
              </tr>
            </>
          ))}
        </Tbody>
      </Table>
      {modalOpen && (
        <ActModal
          isModalOpen={modalOpen}
          setIsModalOpen={onClose}
          title={"Ganti Password"}
        >
          <Input
            type={"text"}
            disabled={true}
            value={selectData?.name || "-"}
            label={"Nama"}
          />
          <Input
            id={"password"}
            label={"Password"}
            onChange={(e) => setPassword(e.target.value)}
            type={"password"}
            value={password}
            placeholder={"Ganti Password"}
          />
          <div className=" flex justify-end pr-1">
            <button
              onClick={handlePasswordChange}
              className="bg-blue px-4 py-2 rounded-md text-white"
            >
              <p>Simpan</p>
            </button>
          </div>
        </ActModal>
      )}
    </div>
  );
};

export default Pembimbing;
