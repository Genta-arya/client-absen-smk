import React from "react";
import { FaSearch } from "react-icons/fa";

const Search = ({ searchTerm, setSearchTerm , placeholder}) => {
  return (
    <div className="relative w-full max-w-sm z-[5]">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <FaSearch className="text-gray-400" />
      </span>
      <input
        type="search"
        placeholder={placeholder}
        className="w-full pl-10 pr-4  text-xs py-2 border rounded-lg shadow-sm focus:outline-none placeholder:text-xs   placeholder:text-gray-500 text-black"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default Search;
