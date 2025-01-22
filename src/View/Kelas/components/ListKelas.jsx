import React, { useState } from "react";
import Table from "../../../components/Table/Table";
import Thead from "../../../components/Table/Thead";
import Th from "../../../components/Table/Th";
import Tbody from "../../../components/Table/Tbody";
import Td from "../../../components/Table/Td";
import Input from "../../../components/Input";
import { ResponseHandler } from "../../../Utils/ResponseHandler";
import { toast } from "sonner";
import { DeleteKelas, EditKelas } from "../../../Api/Services/LoginServices";

const ListKelas = ({ data, fetchData }) => {
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const handleDoubleClick = (id, nama) => {
    setEditId(id);
    setEditValue(nama);
  };

  const onSave = async () => {
    if (editValue.trim() === "") {
      toast.error("Kelas harus diisi");
      return;
    }

    setLoading(true);
    try {
      await EditKelas({ id: editId, nama: editValue });
      toast.success("Kelas Berhasil diubah");
      fetchData();
      setEditId(null);
      setEditValue("");
    } catch (error) {
        console.error(error);
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (data) => {
    setLoading(true);
    try {
      await DeleteKelas(data);
      toast.success("Kelas Berhasil dihapus");
      fetchData();
    } catch (error) {
 
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    setEditId(null);
    setEditValue("");
  };

  return (
    <div>
      <Table>
        <Thead>
          <tr>
            <Th text={"#"} />
            <Th text={"Nama Kelas"} />
            <Th text={"Aksi"} />
          </tr>
        </Thead>
        <Tbody>
          {data.map((kelas, index) => (
            <tr key={kelas.id}>
              <Td text={index + 1} />
              <td className="border ">
                {editId === kelas.id ? (
                  <Input
                    value={editValue}
                    onChange={() => setEditValue(event.target.value)}
                    type="text"
                    min={3}
                    placeholder="Masukkan Nama Kelas"
                    required
                  />
                ) : (
                  <span
                    onDoubleClick={() =>
                      handleDoubleClick(kelas.id, kelas.nama)
                    }
                  >
                    {kelas.nama}
                  </span>
                )}
              </td>
              <td className="border">
                {editId === kelas.id ? (
                  <>
                    <div className="flex  gap-2 items-center justify-center">
                      <button
                        className="bg-blue w-20 hover:opacity-85 transition-all duration-300 text-white px-2 py-1 rounded-md"
                        onClick={onSave}
                      >
                        Simpan
                      </button>
                      <button
                        className="bg-blue w-20 hover:opacity-85 transition-all duration-300 text-white px-2 py-1 rounded-md"
                        onClick={handleCancel}
                      >
                        Batal
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="gap-2 flex justify-center">
                    <button
                      className="w-20 bg-blue hover:opacity-85 transition-all duration-300 text-white px-2 py-1 rounded-md"
                      onClick={() => handleDoubleClick(kelas.id, kelas.nama)}
                    >
                      Edit
                    </button>

                    <button
                      className="w-20 bg-red-500 hover:opacity-85 transition-all duration-300 text-white px-2 py-1 rounded-md"
                      onClick={() => onDelete(kelas.id)}
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default ListKelas;
