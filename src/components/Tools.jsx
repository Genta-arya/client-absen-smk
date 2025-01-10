import React, { useState, useEffect, useRef } from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { menuItems } from "../constants/Constants";

const Tools = ({ title, role }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        Math.min(filteredItems.length - 1, prevIndex + 1)
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      navigate(filteredItems[selectedIndex].path);
    }
  };

  // Menangani kombinasi tombol Ctrl + K
  const handleCtrlK = (e) => {
    if ((e.ctrlKey && e.key === "k") || e.key === "K") {
      e.preventDefault();
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleCtrlK);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleCtrlK);
    };
  }, [selectedIndex, filteredItems]);

  return (
    <div className={` ${ role === "user" && "hidden"} mb-8 -mt-8  border-b p-4 `}>
      {role !== "user" && (
        <>
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer hover:underline w-fit"
          >
            <div className="flex items-center gap-3">
              <FaHome className="hover:underline" />
              <div className="flex items-center gap-4">
                <p>Home</p>
                <FaChevronRight />
                <p>{title}</p>
              </div>
            </div>
          </div>

          <div className="relative mt-4">
            <div className="relative">
              <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search Menu / ( CTRL + K )"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 p-2 border placeholder:text-black text-black rounded-lg focus:outline-none"
              />
            </div>

            {/* Suggestions */}
            {searchTerm && (
              <ul className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto mt-2">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <li
                      key={item.id}
                      className={`p-2 cursor-pointer hover:bg-blue-100 ${
                        index === selectedIndex ? "bg-blue-200" : ""
                      }`}
                      onClick={() => {
                        setSearchTerm("");
                        navigate(item.path);
                      }}
                    >
                      <div className="flex items-center gap-2 text-black text-xs">
                        <item.icon size={12} />
                        <p className="text-xs">{item.name}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 text-center">
                    Menu Not found.
                  </li>
                )}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Tools;
