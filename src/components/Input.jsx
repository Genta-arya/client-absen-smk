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
  min,
  multiple,
}) => {
  const [inputType, setInputType] = useState(type);

  const togglePasswordVisibility = () => {
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  return (
    <div className="mb-4 w-full">
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>

      <input
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        id={id}
        value={value}
        maxLength={maxlength}
        minLength={minlength}
        multiple={false || multiple}
        min={min || 0}
        required={required}
        disabled={false || disabled}
        className={`${style} w-full disabled:bg-white p-2 ${Text} dark:text-black border-b dark:border-gray-300  focus:outline-none`}
      />
      {type === "password" && value.length > 0 && (
        <p
          className="text-end pr-1 mt-1 text-blue cursor-pointer text-xs hover:underline"
          onClick={togglePasswordVisibility}
        >
          {inputType === "password" ? "Tampilkan" : "Sembunyikan"}
        </p>
      )}
    </div>
  );
};

export default Input;
