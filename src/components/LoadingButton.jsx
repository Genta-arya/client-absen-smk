import React from "react";
import { BeatLoader } from "react-spinners";
import { Text } from "../constants/Constants";

const LoadingButton = ({ icon, text, loading }) => {
  return (
    <div className="flex items-center justify-center">
      {loading ? (
        <div className="flex items-center justify-center">
          <BeatLoader size={10} color="#fff" />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          {icon}

          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default LoadingButton;
