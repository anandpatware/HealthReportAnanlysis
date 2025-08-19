import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import UploadPage from "./Pages/UploadPage.jsx";
import Navbar from "./Component/Navbar.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Navbar />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-2xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-blue-600">Hello Tailwind!</h1>
          <p className="mt-4 text-gray-700"></p>
          <Register />
        </div>
      </div>
    </>
  );
}

export default App;
