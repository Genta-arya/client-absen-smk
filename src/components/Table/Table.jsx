import React from "react";

const Table = ({ children, className }) => {
  return (
    <div className={`overflow-x-auto mt-8 ${className} `}>
      <table className="min-w-full bg-white shadow-md  table-auto border-collapse border border-gray-200 dark:bg-gray-600">
      
          {children}
   
      </table>
    </div>
  );
};

export default Table;
