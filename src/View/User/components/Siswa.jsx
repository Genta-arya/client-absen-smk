import React, { useEffect } from "react";
import Table from "../../../components/Table/Table";
import Thead from "../../../components/Table/Thead";
import Tbody from "../../../components/Table/Tbody";
import Th from "../../../components/Table/Th";
import Td from "../../../components/Table/Td";

import { FaArrowRight, FaLockOpen, FaPlus } from "react-icons/fa";

import ActModal from "../../../components/Modal/ActModal";
import Input from "../../../components/Input";
import { ResponseHandler } from "../../../Utils/ResponseHandler";

import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";

const Siswa = ({
  SearchFilter,
  searchTerm,
  dataSiswa,
  loading,
  updatePasswords,
  fetchData,
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [selectData, setSelectData] = React.useState(null);
  const navigate = useNavigate();
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

  const detail = (data) => {
    let parseURIname;
    if (data.name !== null) {
      parseURIname = data.name.replace(/ /g, "-") || "-";
    } else {
      parseURIname = "-";
    }
    navigate(`/detail/profile/${data.id}/${parseURIname}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col">
      <Table>
        <Thead>
          <tr>
            <Th text={"No"} />
            <Th text={"Foto"} />
            <Th text={"NISN"} />
            <Th text={"Nama"} />
            <Th text={"Aksi"} />
          </tr>
        </Thead>
        <Tbody>
          {SearchFilter(dataSiswa, searchTerm).map((siswa, index) => (
            <>
              <tr
                key={siswa.id}
                className="cursor-pointer hover:bg-gray-100 ease-in-out transition-all"
              >
                <Td text={index + 1} />
                <td
                  className="border p-1 cursor-pointer hover:opacity-80"
                  onClick={() => window.open(siswa.avatar)}
                >
                  <div className="flex justify-center">
                    <img src={siswa.avatar} className="w-10" alt=""></img>
                  </div>
                </td>
                <Td text={siswa.nim} />
                <Td text={siswa.name || "-"} />

                <td className="border p-1">
                  <div className="flex flex-col lg:flex-row md:flex-row gap-2 items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleEdit(siswa)}
                      className="bg-blue hover:bg-blue-700 w-32 text-white font-bold py-2 px-4 rounded hover:opacity-85 transition-all  ease-in-out"
                    >
                      <div className="flex gap-2 items-center justify-center">
                        <FaLockOpen />
                        <p className="text-xs">Password</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => detail(siswa)}
                      className="bg-blue hover:bg-blue-700 text-white w-32 font-bold py-2 px-4 rounded hover:opacity-85 transition-all  ease-in-out"
                    >
                      <div className="flex gap-2 items-center justify-center">
                        <p className="text-xs">Detail</p>
                        <FaArrowRight />
                      </div>
                    </button>
                  </div>
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
          <form onSubmit={() => handlePasswordChange()}>
            <Input
              type={"text"}
              disabled={true}
              value={selectData?.name || "-"}
              label={"Nama"}
            />
            <Input
              id={"password"}
              onChange={(e) => setPassword(e.target.value)}
              type={"password"}
              value={password}
              required={true}
              placeholder={"Ganti Password"}
            />
            <div className=" flex justify-end pr-1">
              <button className="bg-blue px-4 py-2 rounded-md text-white">
                <p>Simpan</p>
              </button>
            </div>
          </form>
        </ActModal>
      )}
    </div>
  );
};

export default Siswa;
