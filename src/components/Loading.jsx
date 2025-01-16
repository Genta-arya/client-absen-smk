import React from "react";
import { BeatLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-dark-bg   ">
      <BeatLoader size={18} color="#E49E12" className={`${Text}  `} />
    </div>
  );
};

export default Loading;
