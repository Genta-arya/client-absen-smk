import React from "react";
import DaftarPermohonan from "./DaftarPermohonan";
import AppMenu from "./AppMenu";

const ContentUser = () => {
  return (
    <div className="mt-4">
      <div className="flex flex-col gap-2">
        <div className="bg-white  md:p-5 p-2 lg:p-5 rounded-md">
          <AppMenu />
        </div>
      </div>
    </div>
  );
};

export default ContentUser;
