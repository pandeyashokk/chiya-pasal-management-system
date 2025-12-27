import { Link } from "react-router-dom";
import { Coffee, User, LogOut } from "lucide-react";
import { useState } from "react";

function PrivateNavbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const name = localStorage.getItem("name") || "User";
  const role = localStorage.getItem("role") || "staff";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white text-black shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link className="flex items-center space-x-3 cursor-pointer">
            <div className="flex justify-center items-center text-2xl md:text-3xl font-bold">
              <Coffee size={28} className="text-orange-600 mr-1" />
              Chiya <span className="text-orange-600">Hub</span>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-3 hover:text-orange-600 cursor-pointer transition"
              >
                <User size={38} className="border-2 rounded-full" />
                <div className="text-left">
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm ">{role}</p>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-white rounded-lg shadow-xl py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-100 flex items-center space-x-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PrivateNavbar;
