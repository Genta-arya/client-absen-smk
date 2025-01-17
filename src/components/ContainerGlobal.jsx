import React from "react";
import Footer from "./Footer";
import useAuthStore from "../Lib/Zustand/AuthStore";
import HeaderBack from "./HeaderBack";

const ContainerGlobal = ({ children, visible = false }) => {
  const { user } = useAuthStore();
  return (
    <div>
      <div
        className={`${Text} border-t-8 gap-4 border-oren  bg-light-bg dark:bg-dark-bg text-black dark:text-white
  flex flex-col min-h-screen  `}
      >
        {!visible ? (
          <>
            <HeaderBack />
            <div className="px-6">{children}</div>
          </>
        ) : (

        <div className="px-6 mt-4">{children}</div>
        )}
      </div>
    </div>
  );
};

export default ContainerGlobal;
