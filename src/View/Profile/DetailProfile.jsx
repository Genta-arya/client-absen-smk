import React, { useEffect } from "react";
import ContainerGlobal from "../../components/ContainerGlobal";
import { useParams } from "react-router-dom";
import { getSingleUser } from "../../Api/Services/LoginServices";
import Loading from "../../components/Loading";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import Input from "../../components/Input";
import Calendar from "../../components/Table/Calendar";
import { FaFolderOpen, FaTag } from "react-icons/fa";
import { toast } from "sonner";
import NotfoundData from "../../components/NotfoundData";
import DaftarLaporanMingguan from "../../components/RoleView/Users/Laporan/componets/DaftarLaporanMingguan";
import DaftarLaporan from "../../components/RoleView/Users/Laporan/componets/DaftarLaporan";
import MainLaporan from "../../components/RoleView/Users/Laporan/MainLaporan";

const DetailProfile = () => {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [dataAbsen, setDataAbsen] = React.useState(null);
  const getDataUser = async () => {
    setLoading(true);
    try {
      const response = await getSingleUser(id);
      setData(response.data);
      setDataAbsen(response.data.Pkl[0]?.absensi);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
      }
      
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
        <NotfoundData />
      </ContainerGlobal>
    );
  }

  return (
    <ContainerGlobal title={"Kembali"}>
      <div className="w-full">
        <div className="flex justify-center mb-6">
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

        {data?.Pkl && data?.Pkl.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className=" flex justify-center items-center gap-2  text-blue text-xl font-bold text-center py-4 border-b border-dashed">
              <FaTag />
              <h1 className="">Informasi PKL</h1>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <img src={data.Pkl[0].creator.avatar} alt="" className="w-20" />
              <Input
                value={data.Pkl[0].creator.name}
                label="Guru Pembimbing"
                disabled={true}
                placeholder={"Belum ada Pembimbing"}
              />
            </div>

            <Input
              value={data.Pkl[0].name}
              label="Tempat PKL"
              disabled={true}
              placeholder={"Belum ada PKL"}
            />
            <Input
              value={data.Pkl[0].alamat}
              label="Alamat PKL"
              disabled={true}
              placeholder={"Belum ada Alamat"}
            />
          </div>
        ) : (
          <>
          </>
        )}
      </div>

      {data?.Pkl[0]?.absensi && data?.Pkl[0]?.absensi.length > 0 ? (
        <Calendar data={dataAbsen} />
      ) : (
        <div className="flex justify-center items-center text-xl font-bold text-gray-700 mt-4"></div>
      )}

      {data.role === "user" && (
        <div className="">
          <h2 className="text-xl font-semibold mb-8">
            <div className="flex items-center gap-2">
              <FaFolderOpen />
              <p>Laporan Kegiatan</p>
            </div>
          </h2>
          <MainLaporan />
        </div>
      )}
    </ContainerGlobal>
  );
};

export default DetailProfile;
