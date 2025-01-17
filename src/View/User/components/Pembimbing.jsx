import React from "react";
import Table from "../../../components/Table/Table";
import Thead from "../../../components/Table/Thead";
import Tbody from "../../../components/Table/Tbody";
import Th from "../../../components/Table/Th";
import Td from "../../../components/Table/Td";
import { FaArrowRight, FaLockOpen, FaPlus, FaSave } from "react-icons/fa";
import ActModal from "../../../components/Modal/ActModal";
import Input from "../../../components/Input";
import { ResponseHandler } from "../../../Utils/ResponseHandler";

import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";
import { updateDataUser } from "../../../Api/Services/LoginServices";
import LoadingButton from "../../../components/LoadingButton";
import { toast } from "sonner";

const Pembimbing = ({
  searchTerm,
  SearchFilter,
  dataSiswa,
  loading,
  updatePasswords,
  fetchData,
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [selectData, setSelectData] = React.useState(null); // State for selected data
  const [editingField, setEditingField] = React.useState(null); // State to track the field being edited
  const [loading1, setLoading1] = React.useState(false);
  const navigate = useNavigate();

  const handleEdit = (data) => {
    setSelectData(data);
    setModalOpen(true);
  };

  const onClose = () => {
    setModalOpen(false);
    setPassword("");
    setSelectData(null);
    setEditingField(null);
  };

  console.log(selectData);

  const handlePasswordChange = async () => {
    try {
      await updatePasswords(selectData.id, password);
      onClose();
      fetchData();
    } catch (error) {
      ResponseHandler(error.response);
    }
  };

  const updateData = async () => {
    setLoading1(true);
    try {
      await updateDataUser({
        id: selectData.id,
        name: selectData.name,
        nim: selectData.nim,
        email : selectData.email,
      });

      toast.success("Data berhasil diperbarui");
      setSelectData(null);
      setEditingField(null);
      fetchData();
    } catch (error) {
      setSelectData(null);
      setEditingField(null);
      ResponseHandler(error.response);
    } finally {
      setLoading1(false);
    }
  };

  const detail = (data) => {
    let parseURIname = data.name ? data.name.replace(/ /g, "-") : "-";
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
            <Th text={"NIP"} />
            <Th text={"Nama"} />
            <Th text={"Aksi"} />
          </tr>
        </Thead>
        <Tbody>
          {SearchFilter(dataSiswa, searchTerm).map((siswa, index) => (
            <tr key={siswa.id} className="hover:bg-gray-100 cursor-pointer">
              <Td text={index + 1} />
              <td
                className="border p-1 cursor-pointer hover:opacity-80"
                onClick={() => window.open(siswa.avatar)}
              >
                <div className="flex justify-center">
                  <img src={siswa.avatar} className="w-10" alt="" />
                </div>
              </td>
              <td
                title="Klik untuk edit"
                className="border p-1 hover:underline"
              >
                {editingField === "nip" && selectData?.id === siswa.id ? (
                  <>
                    <Input
                      value={selectData.nim}
                      required={true}
                      onChange={(e) => {
                        setSelectData({ ...selectData, nim: e.target.value });
                      }}
                    />
                    <div className="mb-1 flex md:flex-row lg:flex-row flex-col justify-center gap-2">
                      <button
                        disabled={loading1}
                        className=" bg-blue px-4 text-white rounded-md text-center py-1"
                        onClick={updateData}
                      >
                        <LoadingButton
                          loading={loading1}
                          text={"Simpan"}
                          icon={<FaSave />}
                        />
                      </button>
                      <button
                        type="button"
                        className=" bg-blue px-4 w-full text-white rounded-md text-center py-1"
                        onClick={onClose}
                      >
                        Batal
                      </button>
                    </div>
                  </>
                ) : (
                  <p
                    onClick={() => {
                      setSelectData(siswa);
                      setEditingField("nip");
                    }}
                  >
                    {" "}
                    siswa.nim
                  </p>
                )}
              </td>
              <td
                title="Klik untuk edit"
                className="border p-1 hover:underline"
              >
                {editingField === "name" && selectData?.id === siswa.id ? (
                  <>
                    <Input
                      value={selectData.name}
                      required={true}
                      onChange={(e) => {
                        setSelectData({ ...selectData, name: e.target.value });
                      }}
                    />
                    <div className="mb-1 flex md:flex-row lg:flex-row flex-col justify-center gap-2">
                      <button
                        disabled={loading1}
                        className=" bg-blue px-4 text-white rounded-md text-center py-1"
                        onClick={updateData}
                      >
                        <LoadingButton
                          loading={loading1}
                          text={"Simpan"}
                          icon={<FaSave />}
                        />
                      </button>
                      <button
                        className=" bg-blue px-4 text-white rounded-md text-center py-1"
                        onClick={onClose}
                      >
                        Batal
                      </button>
                    </div>
                  </>
                ) : (
                  <p
                    onClick={() => {
                      setSelectData(siswa);
                      setEditingField("name");
                    }}
                  >
                    {siswa.name || "-"}
                  </p>
                )}
              </td>

              <td className="border p-1">
                <div className="flex flex-col lg:flex-row md:flex-row gap-2 items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleEdit(siswa)}
                    className="bg-blue hover:bg-blue-700 w-32 text-white font-bold py-2 px-4 rounded hover:opacity-85 transition-all ease-in-out"
                  >
                    <div className="flex gap-2 items-center justify-center">
                      <FaLockOpen />
                      <p className="text-xs">Password</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => detail(siswa)}
                    className="bg-blue hover:bg-blue-700 text-white w-32 font-bold py-2 px-4 rounded hover:opacity-85 transition-all ease-in-out"
                  >
                    <div className="flex gap-2 items-center justify-center">
                      <p className="text-xs">Detail</p>
                      <FaArrowRight />
                    </div>
                  </button>
                </div>
              </td>
            </tr>
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
            <div className="flex justify-end pr-1">
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

export default Pembimbing;
