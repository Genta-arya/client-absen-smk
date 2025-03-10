import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Text } from "../constants/Constants";
import { toast } from "sonner";

const NotFound = () => {
  const replaceUrl = () => {
    window.history.replaceState(null, null, "/404");
  };

  useEffect(() => {
    replaceUrl();
  }, []);

  // dalam 3 detik arahkan ke /
  useEffect(() => {
    toast.info("Kamu akan diarahkan ke halaman utama dalam 3 detik.");
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  }, []);

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
      </Helmet>

      <div className=" bg-white dark:bg-dark-bg text-black dark:text-white  flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className={`mt-4 ${Text}`}>
          The page you are looking for does not exist.
        </p>
      </div>
    </>
  );
};

export default NotFound;
