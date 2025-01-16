import React, { useEffect } from "react";
import ContainerGlobal from "../../components/ContainerGlobal";
import { useParams } from "react-router-dom";
import { getSingleUser } from "../../Api/Services/LoginServices";
import Loading from "../../components/Loading";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import Input from "../../components/Input";

const DetailProfile = () => {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);

  const getDataUser = async () => {
    setLoading(true);
    try {
      const response = await getSingleUser(id);
      setData(response.data);
    } catch (error) {
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataUser();
  }, []);

  if (loading) return <Loading />;

  if (!data) {
    return (
      <ContainerGlobal>
        <div className="flex justify-center items-center text-xl font-bold text-gray-700">
          Data pengguna tidak ditemukan
        </div>
      </ContainerGlobal>
    );
  }

  return (
    <ContainerGlobal>
      <div className=" w-full">
        <div
          className="flex justify-center mb-6 "
   
        >
          <img
            src={data.avatar}
            alt="Profile Avatar"
            onClick={() => window.open(data.avatar, "_blank")}
            title="Klik untuk melihat profil"
            className="w-64 rounded object-cover cursor-pointer hover:opacity-95"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Input
            value={data.name}
            placeholder={"Belum ada Nama"}
            label="Nama"
            disabled={true}
          />
          <Input value={data.nim} label="Nim" disabled={true} />
          <Input
            value={data.email}
            label="Email"
            disabled={true}
            placeholder={"Belum ada email"}
          />
        </div>
      </div>
    </ContainerGlobal>
  );
};

export default DetailProfile;
