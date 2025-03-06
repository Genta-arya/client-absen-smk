import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editors = ({ value, onChange }) => {
  return (
    <>
      <div className="">
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link"],
              [{ align: [] }],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "list",
            "bullet",
            "link",
           
            "align",
          ]}
          className=""
        />
      </div>
    </>
  );
};

export default Editors;
