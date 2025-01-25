import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addSiswaToPkl,
  DeletePkl,
  getSinglePkl,
  removeSingleUser,
  updateStatusPkl,
} from "../../../../Api/Services/PKLServices";
import Loading from "../../../Loading";
import ContainerGlobal from "../../../ContainerGlobal";
import { FaPlus, FaTag, FaTrash } from "react-icons/fa";
import Input from "../../../Input";
import { useNavigate } from "react-router-dom";
import EditPkl from "./EditPkl";
import ActModal from "../../../Modal/ActModal";
import { toast } from "sonner";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";
import Button from "../../../Button";
import Select from "react-select";
import useUser from "../../../../Lib/Hook/useUser";
import { BeatLoader } from "react-spinners";
const DetailPkl = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [modal1, setModal1] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalSiswa, setModalSiswa] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectUser, setSelectUser] = useState([]);
  const { loading: loadingUser, userOptions, getDataUsers } = useUser();
  const [status, setStatus] = useState(null);

  const toggleStatus = async () => {
    setLoading(true);
    try {
      await updateStatusPkl({
        id: data?.id,
      });

      fetchData();
      setStatus(data?.status);
      toast.success("Status PKL Berubah");
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getSinglePkl(id);
      setData(response.data);
    } catch (error) {
      if (error.response.status === 404) {
        navigate("/admin/management/pkl");
      }
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeletePkl(id);
      setModal(false);
      fetchData();
      toast.success("Data PKL Berhasil dihapus");
      navigate("/admin/management/pkl");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addSiswaToPkl({
        pkl_id: data?.id,
        user_id: selectUser.map((user) => user.value),
      });
      fetchData();
      setModalSiswa(false);
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

  console.log(data?.users?.length);
  const RemoveSiswa = async () => {
    // jika siswa sisa 1 maka tidak boleh hapus
    // if (data?.users?.length === 1) {
    // toast.error(
    //     "Tidak dapat menghapus siswa , PKL harus memiliki minimal 1 siswa"
    //   );
    //   return;
    // }
    setLoading(true);

    try {
      await removeSingleUser({
        id: data?.id,
        siswaId: deleteId,
      });
      fetchData();
      setDeleteId(null);
      setModal1(false);
      toast.success("Siswa Berhasil dihapus", {
        duration: 2000,
     
      });
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
      }
      toast.error("Gagal menghapus siswa");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setStatus(data?.status);
  }, [data]);

  useEffect(() => {
    getDataUsers();
  }, []);

  const openModalDelete = (id) => {
    setModal1(true);
    setDeleteId(id);
  };

  if (loading) return <Loading />;

  return (
    <>
      {isEdit ? (
        <EditPkl refresh={fetchData} datas={data} setStatusEdit={setIsEdit} />
      ) : (
        <ContainerGlobal>
          <div className="pb-8">
            <div className="mb-8">
              <div className="space-y-4">
                <p className="text-gray-700">
                  <div className="flex items-center gap-2">
                    <FaTag />
                    <p className="font-bold text-base md:text-lg">
                      {data?.name}
                    </p>
                  </div>
                </p>
                <Input disabled={true} value={data?.alamat} label={"Alamat"} />

                <>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-2 text-xs py-1 rounded ${
                          status
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {status ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </p>

                    <div
                      className={`flex items-center space-x-4  cursor-pointer`}
                      onClick={toggleStatus}
                    >
                      <div
                        className={`w-[50px] h-4 flex items-center p-1 rounded-full ${
                          status ? "bg-green-400" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-yellow-500 rounded-full shadow-md transform transition-all duration-300 ${
                            status ? "translate-x-[30px]" : ""
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center pb-4  border-b border-dashed">
                <h2 className="text-xl font-semibold text-gray-800">
                  Daftar Siswa PKL
                </h2>
                <Button
                  style={"bg-blue"}
                  icon={<FaPlus />}
                  title="Tambah Siswa"
                  onClick={() => setModalSiswa(true)}
                />
              </div>
              {data?.users.length === 0 && (
                <p className="text-gray-500 text-center mt-10 font-bold text-sm">
                  Belum ada siswa
                </p>
              )}
              <ul className="space-y-4">
                {data?.users.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModalDelete(user.id)}
                          title="Hapus Siswa"
                          className=""
                        >
                          <FaTrash className="text-red-500" />
                        </button>
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-medium">
                          {user.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          NISN: {user.nim}
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        navigate(
                          `/admin/detail/profile/${user.id}/${user.name}`
                        )
                      }
                      className="text-xs cursor-pointer hover:underline"
                    >
                      Lihat Detail
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center gap-2 items-center w-full text-center">
              <button
                onClick={() => setIsEdit(!isEdit)}
                className="bg-blue rounded-md text-xs text-white py-2 text-center w-40 hover:opacity-80 transition"
              >
                Edit PKL
              </button>
              <button
                onClick={() => setModal(!modal)}
                className="bg-red-500 text-xs text-white py-2 rounded-md w-40 text-center  hover:opacity-80 transition"
              >
                Hapus PKL
              </button>
            </div>
          </div>
          {modal && (
            <ActModal
              isModalOpen={modal}
              setIsModalOpen={setModal}
              title={"Konfirmasi"}
            >
              <div>
                <h1 className="text-center font-bold text-red-500">
                  Menghapus PKL akan menghapus semua data absensi dan laporan
                  kegiatan Siswa
                </h1>
                <h1 className="mt-2">
                  Apakah anda yakin ingin menghapus PKL ini?
                </h1>

                <div className="flex justify-end gap-2 items-center w-full text-center mt-4">
                  <button
                    onClick={() => handleDelete(data?.id)}
                    className="bg-red-500 text-white py-2 rounded-md w-40 text-center  hover:opacity-80 transition"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <FaTrash />
                      <p>Lanjutkan</p>
                    </div>
                  </button>
                </div>
              </div>
            </ActModal>
          )}
          {modal1 && (
            <ActModal
              isModalOpen={modal1}
              setIsModalOpen={setModal1}
              title={"Konfirmasi"}
            >
              <div>
                <h1 className="text-center font-bold text-red-500">
                  Menghapus Siswa akan menghapus semua data absensi dan laporan
                  kegiatan
                </h1>
                <h1 className="mt-2">
                  Apakah anda yakin ingin menghapus Siswa ini?
                </h1>

                <div className="flex justify-end gap-2 items-center w-full text-center mt-4">
                  <button
                    onClick={() => RemoveSiswa(deleteId)}
                    className="bg-red-500 text-white py-2 rounded-md w-40 text-center  hover:opacity-80 transition"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <FaTrash />
                      <p>Lanjutkan</p>
                    </div>
                  </button>
                </div>
              </div>
            </ActModal>
          )}
          {modalSiswa && (
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
                  Jika Pkl sudah dimulai maka siswa akan ketinggalan jadwal
                  absensi tanggal sebelumnya.{" "}
                </p>
                <div className="text-xs">
                  {loadingUser ? (
                    <div className="flex items-center justify-center">
                      <BeatLoader size={10} color="#294A70" />
                    </div>
                  ) : (
                    <>
                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-2"
                      >
                        <Select
                          options={userOptions}
                          isMulti
                          placeholder="Cari Siswa..."
                          required
                          noOptionsMessage={() => "Tidak ada siswa"}
                          onChange={(selectedOptions) =>
                            setSelectUser(selectedOptions)
                          }
                        />
                        <button type="submit" className="flex justify-end">
                          <div className="bg-blue text-white py-2 rounded-md w-40 text-center  hover:opacity-80 transition">
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
          )}
        </ContainerGlobal>
      )}
    </>
  );
};

export default DetailPkl;
