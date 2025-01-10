import React from "react";

const Button = ({ style, onClick, icon, title, type }) => {
  return (
    <button
      type={type || "button"}
      title={title}
      className={`${style}   rounded-md py-2 px-3 transition-all duration-300 ease-in-out hover:opacity-85`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3  md:w-36 lg:w-40 w-36 justify-center text-white">
        {icon}
        <p className="font-bold leading-5 text-sm lg:text-base md:text-sm">{title}</p>
      </div>
    </button>
  );
};

export default Button;
