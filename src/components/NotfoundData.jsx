import React from "react";
import image from "../assets/notfound.png";
const NotfoundData = () => {
  return (
    <div className="flex justify-center  mt-52 md:mt-12 lg:mt-12">
      <img src={ image } alt="" className=" md:w-[60%] lg:w-[40%] w-[80%]" />
    </div>
  );
};

export default NotfoundData;
