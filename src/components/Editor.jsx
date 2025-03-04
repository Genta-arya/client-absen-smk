import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import { Editor } from "@tinymce/tinymce-react";
import { disableInstantTransitions } from "framer-motion";
const Editors = ({ value, onChange }) => {
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  return (
    <>
      {isEditorLoading && (
        <div className="flex items-center justify-center h-48">
          <BeatLoader size={10} color="blue" />
        </div>
      )}

      <Editor
        tinymceScriptSrc="https://cdn.tiny.cloud/1/azzsxiwq7ddj57tp914f7m74kiiezzwpd91333v09liha0x5/tinymce/6/tinymce.min.js"
        apiKey="azzsxiwq7ddj57tp914f7m74kiiezzwpd91333v09liha0x5"
        init={{
          height: 300,
          menubar: true,

          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
            "image",
          ],

          setup: (editor) => {
            editor.on("init", () => setIsEditorLoading(false));
          },

          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help | image",
        }}
        value={value}
        onEditorChange={onChange}
      />
    </>
  );
};

export default Editors;
