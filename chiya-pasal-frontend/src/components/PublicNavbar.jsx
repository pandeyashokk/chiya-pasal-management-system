import { Link } from "react-router-dom";
import { Coffee, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";

const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <nav className="bg-white text-black shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="flex justify-center items-center text-2xl md:text-3xl font-bold">
              <Coffee size={28} className="text-orange-600 mr-1" />
              Chiya <span className="text-orange-600">Hub</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center space-x-2 text-xl hover:text-orange-600 transition"
              >
                <span>{label}</span>
              </Link>
            ))}
            <Link
              to="/login"
              className="bg-orange-600 text-white px-4 py-2 rounded font-semibold hover:rounded-full transition flex items-center space-x-2"
            >
              <LogIn size={20} />
              <span>Staff Login</span>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden cursor-pointer hover:text-orange-600"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-orange-600">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center items-center space-x-3 px-4 py-3 hover:bg-orange-600 hover:text-white hover:rounded-xl transition"
              >
                <span>{label}</span>
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex justify-center items-center mx-4 mt-4 bg-orange-600 text-white px-6 py-3 rounded font-semibold text-center hover:rounded-full transition"
            >
              <LogIn size={20} className="mr-2" />
              Staff Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
