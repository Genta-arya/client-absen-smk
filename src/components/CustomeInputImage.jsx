import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

const CustomeInputImage = ({
  label,
  onChange,
  imagePreview,
  setImagePreview,
}) => {
  const [fileName, setFileName] = useState(null);

  // Fungsi untuk menangani perubahan gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFileName(file.name);
        if (onChange) onChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Fungsi untuk menangani event saat file di-drop ke dalam area
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFileName(file.name);
        if (onChange) onChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium mb-2">{label}</label>

      <div
        onClick={triggerFileInput}
        onDragOver={handleDragOver} // Memastikan area dapat menerima file drag
        onDrop={handleDrop} // Memproses file saat di-drop
        className="flex items-center  cursor-crosshair justify-center w-full p-12 border-2 border-dashed border-gray-300 rounded-md  duration-300 ease-in hover:border-orange-400 transition-all "
      >
        <FaCloudUploadAlt className="text-3xl animate-pulse mr-3" />
        <span className="ml-2  animate-pulse ">
          {imagePreview
            ? "Click or Drag to Change Image"
            : "Click or Drag to Upload Image"}
        </span>

        <input
          id="fileInput"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <div className="flex justify-center flex-col items-center mb-8">
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-52 rounded-md shadow-md"
            />
          </div>
        )}

        {fileName && (
          <div className="mt-2 ">
            <p>Filename: {fileName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomeInputImage;
