import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import UploadPage from "./Pages/UploadPage.jsx";
import Navbar from "./Component/Navbar.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-2xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-blue-600">Hello Tailwind!</h1>
          <p className="mt-4 text-gray-700"></p>
          <UploadPage />
        </div>
      </div>
    </>
  );
}

export default App;
