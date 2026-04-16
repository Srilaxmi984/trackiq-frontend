import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Topbar from "./Topbar";

export default function DeveloperLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f172a] text-white flex flex-col justify-between">

        <div>
          <h1 className="text-xl font-bold p-4 border-b border-gray-700">
            TrackIQ
          </h1>

          <div className="p-3 space-y-2">
            <NavLink to="/developer/dashboard" className="block p-2 rounded hover:bg-blue-500">Dashboard</NavLink>
            <NavLink to="/developer/issues" className="block p-2 rounded hover:bg-blue-500">My Issues</NavLink>
            <NavLink to="/developer/kanban" className="block p-2 rounded hover:bg-blue-500">Kanban</NavLink>

            {/* ✅ NEW */}
            <NavLink to="/developer/feedback" className="block p-2 rounded hover:bg-blue-500">
              Feedback
            </NavLink>

            <NavLink to="/developer/profile" className="block p-2 rounded hover:bg-blue-500">Profile</NavLink>
          </div>
        </div>

        <div className="p-4">
          <button onClick={handleLogout} className="w-full bg-red-600 p-2 rounded">
            Logout
          </button>
        </div>

      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col bg-gray-50">

        <Topbar />

        <div className="p-6 overflow-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}