import React from "react";
import animationData from "../assets/mt.json";
import Lottie from "lottie-react";
const Maintenance = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8  w-full animate-fade-in">
        <Lottie animationData={animationData} loop={true} />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          Maintenance Sedang Berlangsung
        </h1>
        <p className="text-gray-600 mt-2">
          Kami sedang melakukan beberapa pembaruan untuk meningkatkan layanan
          kami. <br />
          Silakan periksa kembali nanti.
        </p>
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Terima kasih
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
