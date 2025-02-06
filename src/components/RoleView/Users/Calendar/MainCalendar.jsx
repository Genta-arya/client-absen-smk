import React, { useEffect, useState } from "react";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import ContainerGlobal from "../../../ContainerGlobal";
import Calendar from "../../../Table/Calendar";
import ActModal from "../../../Modal/ActModal";
import NotfoundData from "../../../NotfoundData";

const MainCalendar = () => {
  const { user } = useAuthStore();

  const dataAbsen = user?.Pkl?.[0]?.absensi || [];
  const [modal, setModal] = useState(false);
  useEffect(() => {
    setModal(true);
  }, []);

  return (
    <ContainerGlobal title={"Kalender"}>
      {dataAbsen.length === 0 ? (
        <NotfoundData />
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
