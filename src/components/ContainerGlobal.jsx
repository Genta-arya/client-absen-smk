import React, { useEffect } from "react";
import useAuthStore from "../Lib/Zustand/AuthStore";
import HeaderBack from "./HeaderBack";

const ContainerGlobal = ({ children, visible = false , title }) => {
  const { user } = useAuthStore();
 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <div
        className={`${Text} border-t-8 gap-4 border-oren  bg-light-bg dark:bg-dark-bg text-black dark:text-white
  flex flex-col min-h-screen  pb-8`}
      >
        {!visible ? (
          <>
            <HeaderBack title={title} />
            <div className="px-6 mt-20">{children}</div>
          </>
        ) : (
          <div className="px-6 mt-4">{children}</div>
        )}
      </div>
    </div>
  );
};

export default ContainerGlobal;
