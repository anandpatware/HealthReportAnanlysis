import { Link } from "react-router-dom";
import { useAuth } from "../App"; // adjust path depending on where you defined useAuth

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-semibold">
          Health Report Analysis
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
          </li>

          {isAuthenticated && (
            <li>
              <Link
                to="/upload"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Upload
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/reports"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Reports
            </Link>
          </li>

          {!isAuthenticated ? (
            <li>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Sign In
              </Link>
            </li>
          ) : (
            <li>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
