import React from "react";
import loading from "../assets/notfound.json";
import Lottie from "lottie-react";
const NotfoundData = () => {
  return (
    <div className="flex justify-center  mt-52 md:mt-12 lg:mt-12">
      <Lottie animationData={loading} autoplay loop={false} className="w-64 h-64" />
    </div>
  );
};

export default NotfoundData;
