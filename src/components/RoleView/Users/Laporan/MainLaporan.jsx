import React, { useState } from "react";
import ContainerGlobal from "../../../ContainerGlobal";
import DaftarLaporan from "./componets/DaftarLaporan";
import Tabs from "./componets/Tabs";
import DaftarLaporanMingguan from "./componets/DaftarLaporanMingguan";

const MainLaporan = () => {
  const tabList = ["harian", "mingguan"]; // Daftar tab
  const [tabsState, setTabsState] = useState(tabList[0]);

  return (
    <ContainerGlobal>
      <div className="flex flex-col gap-14">
        <Tabs
          tabsState={tabsState}
          setTabsState={setTabsState}
          tabs={tabList}
        />
        {tabsState === "harian" ? (
          <DaftarLaporan />
        ) : (
          <DaftarLaporanMingguan />
        )}
      </div>
    </ContainerGlobal>
  );
};

export default MainLaporan;
