import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Utensils, Table, Users } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/menu", label: "Manage Menu", icon: Utensils },
    { to: "/admin/tables", label: "Manage Tables", icon: Table },
    { to: "/admin/staffs", label: "Manage Staffs", icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-20 md:w-48 lg:w-64 bg-white h-screen shadow-lg fixed left-0 top-16 flex flex-col transition-all duration-300">
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <li key={to} className="relative group">
              <Link
                to={to}
                className={`flex items-center justify-center  lg:justify-start px-4 py-4 rounded-lg transition-all duration-200 ${
                  isActive(to)
                    ? "bg-orange-600 text-white"
                    : "text-gray-700 hover:bg-orange-100"
                }`}
                onMouseEnter={() => setHoveredItem(to)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Icon size={24} />
                <span className="ml-4 hidden lg:block">{label}</span>
              </Link>

              {hoveredItem === to && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-50 lg:hidden">
                  {label}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
