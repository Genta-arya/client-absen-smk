import React from "react";
import Footer from "./Footer";
import useAuthStore from "../Lib/Zustand/AuthStore";
import HeaderBack from "./HeaderBack";

const ContainerGlobal = ({ children }) => {
  const { user } = useAuthStore();
  return (
    <div>
      <div
        className={`${Text} border-t-4 gap-4 border-oren bg-light-bg dark:bg-dark-bg text-black dark:text-white
  flex flex-col min-h-screen  `}
      >
        <HeaderBack />
        <div className="px-6">{children}</div>
      </div>
    </div>
  );
};

export default ContainerGlobal;
