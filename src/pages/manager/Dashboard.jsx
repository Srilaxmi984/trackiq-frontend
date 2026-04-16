import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const Dashboard = () => {

  const [data, setData] = useState({
    totalProjects: 0,
    totalIssues: 0,
    avgRating: 0,
    openIssues: 0,
    status: {},
    recentIssues: []
  });

  const [developers, setDevelopers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [extraStats, setExtraStats] = useState({
    highPriority: 0,
    inProgress: 0
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const projRes = await axios.get("http://localhost:8080/api/projects", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const issueRes = await axios.get("http://localhost:8080/api/issues", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const devRes = await axios.get("http://localhost:8080/api/users/developers", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const projects = projRes.data;
        const issues = issueRes.data;

        const statusCount = {
          SUBMITTED: 0,
          IN_PROGRESS: 0,
          DONE: 0
        };

        let highPriority = 0;
        let inProgress = 0;

        issues.forEach(i => {
          if (statusCount[i.status] !== undefined) {
            statusCount[i.status]++;
          }
          if (i.priority === "HIGH") highPriority++;
          if (i.status === "IN_PROGRESS") inProgress++;
        });

        setData({
          totalProjects: projects.length,
          totalIssues: issues.length,
          avgRating: 0,
          openIssues: issues.filter(i => i.status !== "DONE").length,
          status: statusCount,
          recentIssues: issues.slice(0, 10)
        });

        setExtraStats({ highPriority, inProgress });

        setDevelopers(devRes.data);
        setProjects(projects);

      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  const COLORS = ["#3b82f6", "#f59e0b", "#22c55e"];

  const filteredIssues = selectedProject
    ? data.recentIssues.filter(i => i.project?.id == selectedProject)
    : data.recentIssues;

  const getStatusStyle = (status) => {
    switch (status) {
      case "SUBMITTED": return "bg-gray-200 text-gray-700";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-700";
      case "DONE": return "bg-green-100 text-green-700";
      default: return "";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "HIGH": return "text-red-600 font-semibold";
      case "MEDIUM": return "text-orange-500 font-medium";
      case "LOW": return "text-blue-500";
      default: return "";
    }
  };

  return (
    <div className="font-sans">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">Welcome, Manager</h1>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="Total Projects" value={data.totalProjects} />
        <Card title="Total Issues" value={data.totalIssues} />
        <Card title="Open Issues" value={data.openIssues} />
        <Card title="Developers" value={developers.length} />
      </div>

      {/* CHART + SIDE */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3 text-lg">Issues Overview</h3>

          <PieChart width={350} height={280}>
            <Pie
              data={Object.entries(data.status).map(([k, v]) => ({
                name: k,
                value: v
              }))}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {Object.entries(data.status).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <SmallCard title="🔥 High Priority Issues" value={extraStats.highPriority} />
          <SmallCard title="⚡ In Progress Issues" value={extraStats.inProgress} />
          <SmallCard title="📌 Completed Issues" value={data.status.DONE || 0} />
        </div>
      </div>

      {/* FILTER */}
      <div className="mb-4">
        <select
          className="border px-4 py-2 rounded w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-semibold mb-4 text-lg">Recent Issues</h3>

        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Project</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Assigned To</th>
            </tr>
          </thead>

          <tbody>
            {filteredIssues.map((issue, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">

                <td className="p-3">{i + 1}</td>

                <td className="p-3 font-medium text-gray-800">
                  {issue.title}
                </td>

                <td className="p-3 text-gray-600">
                  {issue.project?.name || "-"}
                </td>

                <td className={`p-3 ${getPriorityStyle(issue.priority)}`}>
                  {issue.priority}
                </td>

                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(issue.status)}`}>
                    {issue.status}
                  </span>
                </td>

                {/* ✅ FIXED ASSIGNED COLUMN */}
                <td className="p-3 font-medium text-blue-600">
                  {issue.assignedTo?.name || "Unassigned"}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Dashboard;


// COMPONENTS

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

const SmallCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-xl font-bold">{value}</h2>
  </div>
);