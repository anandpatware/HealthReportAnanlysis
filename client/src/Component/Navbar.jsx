export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 shadow-md z-50 border-4 border-yellow-400 hover:bg-pink-500 transition-colors duration-500">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-semibold">
          Health Report Analysis
        </div>
        <ul className="flex space-x-6">
          <li>
            <a
              href="/"
              className="text-gray-300 hover:text-white transition-colors duration-200 underline decoration-wavy decoration-pink-500"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/upload"
              className="text-gray-300 hover:text-white transition-colors duration-200 underline decoration-wavy decoration-yellow-400"
            >
              Upload
            </a>
          </li>
          <li>
            <a
              href="/reports"
              className="text-gray-300 hover:text-white transition-colors duration-200 underline decoration-wavy decoration-green-400"
            >
              Reports
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
