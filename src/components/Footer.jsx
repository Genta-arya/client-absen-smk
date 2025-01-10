import React from "react";
import { Text } from "../constants/Constants";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-500 dark:bg-dark-bg  py-4 mt-auto">
      <div className=" text-center">
        <p className={Text}>
          &copy; {new Date().getFullYear()} Admin Blog. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
