import React from "react";

const PreviewSEO = ({ title, metaDescription, metaKeywords, image }) => {
  const defaultImage =
    "https://via.placeholder.com/300x200.png?text=Preview+Image";

  if (!title && !metaDescription && !metaKeywords && !image) {
    return (
      <div className="rounded-lg shadow-md mt-8 opacity-0 translate-y-0 transition-all ease-in duration-300"></div>
    );
  }

  return (
    <div className="p-6 border border-gray-300 rounded-lg shadow-md mt-8 transition-all ease-in-out duration-1000 opacity-100 translate-y-0">
      <h2 className="text-2xl font-semibold mb-4">SEO Preview</h2>

      <div className="mb-4">
        <img
          src={image || defaultImage}
          alt="Preview"
          className="w-full max-h-[200px] object-cover rounded-md"
        />
      </div>

      <div className="text-xl font-semibold text-orange-400 mb-2 break-words">
        {title || "Blog - Your Page Title"}
      </div>

      <div className="text-sm text-orange-400 mb-2 underline italic">
        blogs.mgentaarya.my.id
      </div>

      <div className="text-sm break-words">
        {metaDescription || "Example meta description"}
      </div>

      {metaKeywords && (
        <div className="text-xs mt-2 break-words">
          <strong>Keywords:</strong> {metaKeywords}
        </div>
      )}
    </div>
  );
};

export default PreviewSEO;
