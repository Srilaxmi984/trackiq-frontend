import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  MessageSquare,
  User,
  Bell,
  LogOut
} from "lucide-react";

export default function ReporterLayout() {

  const navigate = useNavigate();

  // 🔥 later replace with actual user from backend
  const userName = "Srilaxmi";

  const handleLogout = () => {
    // later: remove token
    localStorage.clear();
    navigate("/");
  };

  const menu = [
    { name: "Dashboard", path: "/reporter/dashboard", icon: LayoutDashboard },
    { name: "New Complaint", path: "/reporter/new", icon: PlusCircle },
    { name: "My Complaints", path: "/reporter/complaints", icon: List },
    { name: "Feedback", path: "/reporter/feedback", icon: MessageSquare },
    { name: "Profile", path: "/reporter/profile", icon: User },
  ];

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-black text-white flex flex-col justify-between">

        <div>
          <h1 className="text-xl font-bold p-4 border-b border-gray-700">
            TrackIQ
          </h1>

          <div className="p-3">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg mb-2 ${
                      isActive ? "bg-blue-600" : "hover:bg-gray-800"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* 🔥 LOGOUT */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full bg-red-600 p-2 rounded hover:bg-red-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gray-50 flex flex-col">

        {/* 🔥 TOP BAR */}
        <div className="flex justify-between items-center bg-white p-4 shadow">

          <h2 className="text-lg font-semibold">
            Reporter Panel
          </h2>

          <div className="flex items-center gap-4">

            {/* 🔔 Notification */}
            <Bell className="cursor-pointer text-gray-600" />

            {/* 👤 User */}
            <div className="font-medium text-gray-700">
              Hi, {userName}
            </div>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="p-6 overflow-auto flex-1">
          <Outlet />
        </div>

      </div>

    </div>
  );
}