import React, { useEffect, useState } from "react";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import ContainerGlobal from "../../../ContainerGlobal";
import Calendar from "../../../Table/Calendar";
import ActModal from "../../../Modal/ActModal";

const MainCalendar = () => {
  const { user } = useAuthStore();

  const dataAbsen = user?.Pkl?.[0]?.absensi || [];
  const [modal, setModal] = useState(false);
  useEffect(() => {
    setModal(true);
  }, []);

  return (
    <ContainerGlobal>
      {dataAbsen.length === 0 ? (
        <h1 className="text-gray-700 text-sm text-center mt-20">Anda belum memiliki absensi</h1>
      ) : (
        <Calendar data={dataAbsen} />
      )}
      {modal && (
        <ActModal
          isModalOpen={modal}
          setIsModalOpen={setModal}
          title={"Informasi"}
        >
          <div>
            <h1 className="text-gray-700 text-sm">
              Tap jam kehadiran yang ada di kalender untuk melihat detail
              absensi.
            </h1>
          </div>
        </ActModal>
      )}
    </ContainerGlobal>
  );
};

export default MainCalendar;
