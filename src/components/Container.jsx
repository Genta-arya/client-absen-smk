import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { Text } from "../constants/Constants";
import Footer from "./Footer";
import Tools from "./Tools";

const Container = ({ children, role }) => {
  return (
    <>
      <div className={`${role === "user" && "hidden"} `}>
        <Navbar role={role} />
      </div>

      <div
        className={`${Text} md: bg-light-bg dark:bg-dark-bg text-black dark:text-white
  flex flex-col min-h-screen   lg:px-4 md:px-4 px-1 py-8`}
      >
        {children}
      </div>

      {role !== "user" && <Footer />}
    </>
  );
};

export default Container;
