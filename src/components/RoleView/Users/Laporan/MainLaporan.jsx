import React, { useState } from "react";
import ContainerGlobal from "../../../ContainerGlobal";
import DaftarLaporan from "./componets/DaftarLaporan";
import Tabs from "./componets/Tabs";
import DaftarLaporanMingguan from "./componets/DaftarLaporanMingguan";
import { useLocation } from "react-router-dom";

const MainLaporan = () => {
  const tabList = ["harian", "mingguan"];
  const [tabsState, setTabsState] = useState(tabList[0]);
  const path = useLocation().pathname;

  //  jika path include /admin

  return (
    <>
      {path.includes("/admin") ? (
        <div className="flex flex-col gap-10">
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
      ) : (
        <ContainerGlobal title={"Laporan"}>
          <div className="flex flex-col gap-10">
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
      )}
    </>
  );
};

export default MainLaporan;
