import React from "react";
import { PropagateLoader, PuffLoader } from "react-spinners";
import loading from "../assets/loading.json";
import Lottie from "lottie-react";
const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-dark-bg bg-white   ">
      <Lottie
        animationData={loading}
        autoplay
        loop
        className="w-64 h-64"
      />
    </div>
  );
};

export default Loading;
