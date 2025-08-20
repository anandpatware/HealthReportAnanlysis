import "./App.css";
import UploadPage from "./Pages/UploadPage.jsx";
import Navbar from "./Component/Navbar.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { useState, createContext, useContext } from "react";

const AuthContext = createContext();

function useAuth() {
  return useContext(AuthContext);
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/upload"
          element={isAuthenticated ? <UploadPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </AuthContext.Provider>
  );
}
export { useAuth };
export default App;
