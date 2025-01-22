import React, { useEffect, useState } from "react";

import Container from "../../components/Container";
import Tools from "../../components/Tools";
import ListKelas from "./components/ListKelas";
import Button from "../../components/Button";
import { FaPlus, FaSave } from "react-icons/fa";
import ActModal from "../../components/Modal/ActModal";
import Input from "../../components/Input";
import LoadingButton from "../../components/LoadingButton";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import { CreateKelas, getKelas } from "../../Api/Services/LoginServices";
import { toast } from "sonner";
import Search from "../../components/Search";
import Loading from "../../components/Loading";

const MainKelas = () => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [kelas, setKelas] = useState("");
  const [data, setData] = useState([]);

  const filterData = (data, searchTerm) => {
    return data.filter((item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getKelas();
      const urutAbjad = response.data.sort((a, b) => a.nama.localeCompare(b.nama));
      setData(urutAbjad);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await CreateKelas({ nama: kelas });
      setKelas("");
      fetchData();
      toast.success("Berhasil menambahkan Kelas.");
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />
  return (
    <Container>
      <Tools title={"Management Kelas"} />

      <div className="px-4 flex-col flex">
        <div className="flex justify-between items-center gap-2">
          <Button
            onClick={() => setModal(true)}
            icon={<FaPlus />}
            style="bg-blue"
            title="Kelas"
          />

          <Search
            placeholder={"Cari Kelas"}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>

      <ListKelas fetchData={fetchData} data={filterData(data, searchTerm)} />

      {modal && (
        <ActModal
          isModalOpen={modal}
          setIsModalOpen={setModal}
          title={"Tambah Kelas"}
        >
          <form onSubmit={handleSave}>
            <Input
              id={"Kelas"}
              label={"Kelas"}
              required={true}
              maxlength={40}
              minlength={3}
              placeholder={"Nama Kelas"}
              value={kelas}
              onChange={() => setKelas(event.target.value)}
            />

            <button className="bg-blue w-full py-1 text-white rounded-md hover:opacity-85">
              <LoadingButton
                loading={loading}
                icon={<FaSave />}
                text={"Save"}
              />
            </button>
          </form>
        </ActModal>
      )}
    </Container>
  );
};

export default MainKelas;
