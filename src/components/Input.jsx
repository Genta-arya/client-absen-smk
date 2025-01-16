import React, { useState } from "react";
import { Text } from "../constants/Constants";

const Input = ({
  style,
  onChange,
  type,
  placeholder,
  id,
  value,
  required,
  label,
  maxlength,
  minlength,
  disabled,
}) => {
  const [inputType, setInputType] = useState(type); // State untuk menentukan tipe input (password/text)

  const togglePasswordVisibility = () => {
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-lg font-medium mb-2">
        {label}
      </label>
      {type === "password" && (
        <p
          className="text-end pr-1 mb-1 text-blue-500 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {inputType === "password" ? "Tampilkan" : "Sembunyikan"}
        </p>
      )}
      <input
        onChange={onChange}
        type={inputType}
        placeholder={placeholder}
        id={id}
        value={value}
        maxLength={maxlength}
        minLength={minlength}
        required={required}
        disabled={false || disabled}
        className={`${style} w-full p-2 ${Text} dark:text-black border dark:border-gray-300 rounded-md focus:outline-none`}
      />
    </div>
  );
};

export default Input;
