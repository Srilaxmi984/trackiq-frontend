import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  FileText,
  Kanban,
  Users,
  BarChart,
  User,
  LogOut
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate(); // ✅ ADD THIS

  const menu = [
    { name: "Dashboard", path: "/manager/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Projects", path: "/manager/projects", icon: <Folder size={18} /> },
    { name: "Issues", path: "/manager/issues", icon: <FileText size={18} /> },
    { name: "Kanban", path: "/manager/kanban", icon: <Kanban size={18} /> },
    { name: "Developers", path: "/manager/developers", icon: <Users size={18} /> },
    { name: "Feedback", path: "/manager/feedback", icon: <BarChart size={18} /> },
    { name: "Profile", path: "/manager/profile", icon: <User size={18} /> },
  ];

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    // Clear auth (based on what you use)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to home
    navigate("/");
  };

  return (
    <div className="w-64 bg-[#0f172a] text-white flex flex-col p-4">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <img src="/logo.png" className="w-8 h-8" />
        <h1 className="text-lg font-bold">TrackIQ</h1>
      </div>

      {/* Menu */}
      <div className="flex-1 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg transition ${
                isActive
                  ? "bg-[#1e3a8a]"
                  : "hover:bg-[#1e3a8a]/50"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}   // ✅ ADD THIS
        className="flex items-center gap-2 mt-6 p-2 hover:bg-red-500 rounded-lg transition"
      >
        <LogOut size={18} />
        Logout
      </button>

    </div>
  );
};

export default Sidebar;