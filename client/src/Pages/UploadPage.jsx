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

  const getFileAnalysis = async () => {
    if (!selectedFile) return;
    const body = new FormData();
    body.append("file", selectedFile);
    try {
      const response = await fetch(
        "http://localhost:5007/api/ClaudeApi/ask-from-file",
        {
          method: "POST",
          body: body,
          // Do not set Content-Type header for FormData; browser will set it automatically
        }
      );
      if (response.ok) {
        const data = await response.json();
        setRes(data.response);
      } else {
        setRes("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setRes("Failed to upload file. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="text-3xl font-bold mb-6 text-purple-700 drop-shadow-lg">
        Upload a File
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center w-full max-w-md">
        <input
          className="mb-4 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="file"
          accept=".pdf, image/*"
          onChange={handleFileChange}
        />
        {previewUrl && (
          <img
            className="preview mb-4 rounded-lg border border-gray-200 shadow"
            src={previewUrl}
            alt="Preview"
            style={{ maxHeight: "200px", maxWidth: "100%" }}
          />
        )}
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400"
          disabled={!selectedFile}
          onClick={getFileAnalysis}
        >
          Upload
        </button>
      </div>
      {res && (
        <div className="mt-6 bg-green-100 text-green-800 px-4 py-2 rounded shadow">
          {res}
        </div>
      )}
    </div>
  );
}
