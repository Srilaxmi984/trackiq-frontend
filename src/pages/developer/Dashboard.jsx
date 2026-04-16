import { useEffect, useState } from "react";
import axios from "axios";

export default function DeveloperDashboard() {

  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const res = await axios.get(
          `http://localhost:8080/api/issues/developer/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setIssues(res.data || []);

      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ COUNTS
  const assigned = issues.filter(i => i.status === "ASSIGNED").length;
  const inProgress = issues.filter(i => i.status === "IN_PROGRESS").length;
  const done = issues.filter(i => i.status === "DONE").length;

  // ✅ DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="font-sans">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-2 text-gray-800">
        Developer Dashboard
      </h1>

      <p className="text-gray-500 mb-6">
        Welcome back 👋
      </p>

      {/* ✅ STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Assigned Issues</p>
          <h2 className="text-xl font-bold text-blue-700">{assigned}</h2>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow">
          <p className="text-gray-600 text-sm">In Progress</p>
          <h2 className="text-xl font-bold text-yellow-600">{inProgress}</h2>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Completed</p>
          <h2 className="text-xl font-bold text-green-600">{done}</h2>
        </div>

      </div>

      {/* ✅ RECENT ISSUES TABLE */}
      <div className="bg-white rounded-xl shadow p-5">

        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Recent Issues
        </h2>

        {issues.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No issues assigned yet 🚀
          </p>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Project</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Updated</th>
              </tr>
            </thead>

            <tbody>
              {issues.slice(0, 5).map(issue => (
                <tr key={issue.id} className="border-t hover:bg-gray-50">

                  <td className="p-3 font-medium text-gray-800">
                    {issue.title}
                  </td>

                  <td className="p-3 text-gray-500">
                    {issue.project?.name || "-"}
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      issue.status === "ASSIGNED"
                        ? "bg-blue-100 text-blue-700"
                        : issue.status === "IN_PROGRESS"
                        ? "bg-yellow-100 text-yellow-700"
                        : issue.status === "DONE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {issue.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="p-3 text-xs text-gray-400">
                    {formatDate(issue.updatedAt)}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}