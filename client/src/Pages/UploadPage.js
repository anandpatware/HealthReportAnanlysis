import React, { useState } from "react";
import "./UploadPage.css";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [res, setRes] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-title">Upload a File</div>
      <div className="upload-box">
        <input
          className="file-input"
          type="file"
          accept=".pdf, image/*"
          onChange={handleFileChange}
        />
        {previewUrl && (
          <img className="preview" src={previewUrl} alt="Preview" />
        )}
      </div>
      {res && <div className="response-box">{res}</div>}
    </div>
  );
}
