import { FileText, Bug, CheckCircle, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ReporterDashboard() {

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    feedback: 0,
  });

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const res = await axios.get(
          `http://localhost:8080/api/issues/reporter/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const issues = res.data;

        const total = issues.length;
        const open = issues.filter(i => i.status === "SUBMITTED").length;
        const resolved = issues.filter(i => i.status === "DONE").length;
        const feedback = issues.filter(i => i.feedbackGiven).length;

        setStats({ total, open, resolved, feedback });

        setRecent(issues.slice(0, 5));

      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchDashboard();
  }, []);

  // 🎨 STATUS COLOR
  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-gray-200 text-gray-700";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";
      case "DONE":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100";
    }
  };

  // 🎨 PRIORITY COLOR
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "LOW":
        return "text-green-600";
      case "MEDIUM":
        return "text-yellow-600";
      case "HIGH":
        return "text-orange-600";
      case "CRITICAL":
        return "text-red-600 font-semibold";
      default:
        return "";
    }
  };

  return (
    <div className="p-4">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-1">Reporter Dashboard</h1>
      <p className="text-gray-500 mb-6">Welcome back</p>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="My Complaints" value={stats.total} icon={<FileText />} />
        <Card title="Open" value={stats.open} icon={<Bug />} />
        <Card title="Resolved" value={stats.resolved} icon={<CheckCircle />} />
        <Card title="Feedback Given" value={stats.feedback} icon={<MessageSquare />} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Recent Complaints</h2>
        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">S.No</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Priority</th>
            </tr>
          </thead>

          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-400">
                  No complaints yet
                </td>
              </tr>
            ) : (
              recent.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">

                  {/* S.NO */}
                  <td className="p-3 font-medium">{index + 1}</td>

                  {/* TITLE */}
                  <td className="p-3">{item.title}</td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>

                  {/* PRIORITY */}
                  <td className={`p-3 font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}


// 🔹 CARD
function Card({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-xl font-bold">{value}</h2>
      </div>
      <div className="text-blue-500">{icon}</div>
    </div>
  );
}