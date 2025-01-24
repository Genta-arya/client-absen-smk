import React from "react";
import useAuthStore from "../../../../Lib/Zustand/AuthStore";
import ContainerGlobal from "../../../ContainerGlobal";

import { formatTanggal } from "../../../../constants/Constants";
import {FaCircle, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotfoundData from "../../../NotfoundData";
const MainAbsensi = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const mapData = user?.Pkl?.map((item) => item);
  const filterData = mapData?.filter((item) => item.isDelete === false);

  return (
    <>
      <ContainerGlobal>
        <div className="my-6">
          {filterData?.length === 0 ? (
            <>
            <NotfoundData />
            </>
            
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
              {filterData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 border border-dashed"
                >
                  <div className="flex items-center gap-2">
                    <FaTag className="text-blue-500" />
                    <h2 className="lg:text-xl md:text-xl text-base font-semibold text-blue-500">
                      {item.name}
                    </h2>
                  </div>
                  <p className="text-gray-700 border border-dashed px-4 py-1">
                    {item.alamat}
                  </p>
                  <div className="text-xs border-b p-1">
                    <div className="py-1">
                      <h1 className="text-center font-bold text-base">
                        Periode
                      </h1>
                      <h1 className="text-center font-bold text-sm">
                        Praktek Kerja Lapangan
                      </h1>
                    </div>
                    <div className="flex gap-2 items-center justify-center">
                      <p className="text-gray-700 text-xs">
                        <strong></strong> {formatTanggal(item.tanggal_mulai)}
                      </p>
                      <p>-</p>
                      <p className="text-gray-700">
                        <strong></strong> {formatTanggal(item.tanggal_selesai)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h1 className="mt-2 text-sm font-bold">Pembimbing</h1>
                    <div className="flex items-center gap-2">
                      <img
                        src={item.creator?.avatar}
                        alt=""
                        onClick={() => window.open(item.creator?.avatar)}
                        className="w-10 rounded-sm cursor-pointer hover:opacity-80"
                      />
                      <div className="flex flex-col">
                        <h1 className="font-bold text-sm">
                          {item.creator?.name}
                        </h1>
                        <h1 className="text-xs">{item.creator?.nim}</h1>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Dibuat: {formatTanggal(item.createdAt)}
                    </p>
                  </div>

                  <div className="mt-4 text-xs flex justify-between items-center">
                    <div>
                      {item.status === true ? (
                        <div className="flex items-center gap-1">
                          <FaCircle className="text-green-500" />
                          <p className="text-green-500">Aktif</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <FaCircle className="text-red-500" />
                          <p className="text-red-500">Selesai</p>
                        </div>
                      )}
                    </div>
                    {/* <div
                      onClick={() => navigate(`/app/detail/absensi`)}
                      className="flex hover:opacity-85 cursor-pointer transition-all duration-300 items-center justify-center gap-2 bg-blue text-white px-4 py-2 rounded-md"
                    >
                      <button className="">
                        <FaArrowRight />
                      </button>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ContainerGlobal>
   
    </>
  );
};

export default MainAbsensi;
