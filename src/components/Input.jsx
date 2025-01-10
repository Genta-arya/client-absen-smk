import React from "react";
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
}) => {
  return (
    <>
      <div className="mb-4">
        <label htmlFor="title" className="block text-lg font-medium mb-2">
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
          required={required}
          className={`${style} w-full p-2 ${Text} dark:text-black  border dark:border-gray-300 rounded-md focus:outline-none`}
        />
      </div>
    </>
  );
};

export default Input;
