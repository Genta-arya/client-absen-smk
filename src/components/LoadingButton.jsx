import React from "react";
import { BeatLoader } from "react-spinners";
import { Text } from "../constants/Constants";

const LoadingButton = ({ text, loading }) => {
  return (
    <div className="flex items-center justify-center">
      {loading ? (
        <div className="flex items-center justify-center">
         <BeatLoader size={10} color="#fff"  />
        </div>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};

export default LoadingButton;
