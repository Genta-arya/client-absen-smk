import React from "react";
import {  PropagateLoader, PuffLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-dark-bg   ">
      <PuffLoader size={60} color="#294A70" className={`${Text}  `} />
    </div>
  );
};

export default Loading;
