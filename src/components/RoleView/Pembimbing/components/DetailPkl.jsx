import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DeletePkl,
  getSinglePkl,
  removeSingleUser,
  updateStatusPkl,
} from "../../../../Api/Services/PKLServices";
import Loading from "../../../Loading";
import ContainerGlobal from "../../../ContainerGlobal";
import { FaClock, FaPlus, FaPrint, FaTag, FaTrash } from "react-icons/fa";
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
import ModalAddsiswa from "./ModalAddsiswa";
const DetailPkl = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);
  const [modal1, setModal1] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalSiswa, setModalSiswa] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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
    setLoading(true);
    try {
      await DeletePkl(id);
      setModal(false);

      toast.success("Data PKL Berhasil dihapus");
      navigate("/admin/management/pkl");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const RemoveSiswa = async () => {
    setLoading(true);

    try {
      await removeSingleUser({
        id: data?.id,
        isDelete: data?.users?.length === 1 ? true : false,
        siswaId: deleteId,
      });

      setDeleteId(null);
      setModal1(false);
      toast.success("Siswa Berhasil dihapus", {
        duration: 2000,
      });
      window.location.reload();
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

  const FormatJam = ({ item }) => {
    const formatTime = (time) => {
      const date = new Date(time);

      console.log(date);
      return (
        date.getHours().toString().padStart(2, "0") +
        ":" +
        date.getMinutes().toString().padStart(2, "0")
      );
    };

    return (
      <div>
        <p className="flex items-center gap-2 text-blue">
          <FaClock />
          {formatTime(item?.jamMasuk)} - {formatTime(item?.jamPulang)}
        </p>
      </div>
    );
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
                <div className="flex flex-row-reverse items-center gap-2 justify-between">
                  <Link to={`/admin/management/pkl/rekap/absensi/${data?.id}`} className="flex text-sm  hover:underline cursor-pointer hover:font-extrabold items-center gap-2">
                    <FaPrint />
                    <h1 className="text-center  font-bold">Rekap Absensi</h1>
                  </Link>
                  <p className="text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaTag />
                      <p className="font-bold text-base md:text-lg">
                        {data?.name}
                      </p>
                    </div>
                  </p>
                </div>
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
                  <div>
                    <h1 className="text-center font-bold mt-12">
                      Kategori shift
                    </h1>

                    {data?.shifts?.length === 0 && (
                      <p className="text-gray-500 text-center mt-5 font-bold text-sm">
                        Belum ada shift
                      </p>
                    )}

                    <div
                      className={`flex text-sm ${
                        data?.shifts?.length > 2
                          ? "flex-col gap-0 items-center"
                          : " flex-row gap-5"
                      }  justify-evenly `}
                    >
                      {data?.shifts?.map((item) => (
                        <>
                          <div
                            className={`flex flex-col ${
                              data?.shifts?.length > 3
                                ? "items-center mt-4"
                                : "items-center py-4"
                            } `}
                            key={item.id}
                          >
                            <p>{item?.name}</p>
                            <div>
                              <FormatJam item={item} />
                            </div>
                          </div>
                        </>
                      ))}
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
            <ModalAddsiswa
              modalSiswa={modalSiswa}
              setModalSiswa={setModalSiswa}
              loadingUser={loadingUser}
              userOptions={userOptions}
              data={data}
              fetchData={fetchData}
              setLoading={setLoading}
            />
          )}
        </ContainerGlobal>
      )}
    </>
  );
};

export default DetailPkl;
