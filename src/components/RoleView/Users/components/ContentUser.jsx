import React from "react";
import DaftarPermohonan from "./DaftarPermohonan";
import AppMenu from "./AppMenu";

const ContentUser = () => {
  return (
    <div className="mt-8 mb-4 px-4 ">
      <div className="flex flex-col gap-2">
        <AppMenu />
        <DaftarPermohonan />
      </div>
    </div>
  );
};

export default ContentUser;
