import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DeletePkl, getSinglePkl } from "../../../../Api/Services/PKLServices";
import Loading from "../../../Loading";
import ContainerGlobal from "../../../ContainerGlobal";
import { FaTag, FaTrash } from "react-icons/fa";
import Input from "../../../Input";
import { useNavigate } from "react-router-dom";
import EditPkl from "./EditPkl";
import ActModal from "../../../Modal/ActModal";
import { toast } from "sonner";
import { ResponseHandler } from "../../../../Utils/ResponseHandler";

const DetailPkl = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [newUser, setNewUser] = useState("");
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getSinglePkl(id);
      setData(response.data);
    } catch (error) {
      if (error.response.status === 404) {
        navigate("/management/pkl");
      }
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await DeletePkl(id);
      setModal(false);
      toast.success("Data PKL Berhasil dihapus");
      navigate("/management/pkl");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = async () => {
    try {
      fetchData();
      setNewUser("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      {isEdit ? (
        <EditPkl refresh={fetchData} datas={data} setStatusEdit={setIsEdit} />
      ) : (
        <ContainerGlobal>
          <div className="">
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

                <p className="text-gray-700">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded ${
                      data?.status
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {data?.status ? "Aktif" : "Tidak Aktif"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-dashed">
                Daftar Siswa PKL
              </h2>
              <ul className="space-y-4">
                {data?.users.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
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
                        navigate(`/detail/profile/${user.id}/${user.name}`)
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
                className="bg-blue rounded-md text-white py-2 text-center w-40 hover:opacity-80 transition"
              >
                Edit PKL
              </button>
              <button
                onClick={() => setModal(!modal)}
                className="bg-red-500 text-white py-2 rounded-md w-40 text-center  hover:opacity-80 transition"
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
                    onClick={ () => handleDelete(data?.id)}
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
        </ContainerGlobal>
      )}
    </>
  );
};

export default DetailPkl;
