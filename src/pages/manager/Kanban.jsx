import { useState, useEffect } from "react";
import API from "../../services/api";

const Kanban = () => {

  const [project, setProject] = useState("");
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [draggedId, setDraggedId] = useState(null);

  const columns = ["SUBMITTED", "ASSIGNED", "IN_PROGRESS", "TESTING", "DONE"];

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {

        const [issueRes, projectRes] = await Promise.all([
          API.get("/issues"),
          API.get("/projects")
        ]);

        console.log("ISSUES DATA 👉", issueRes.data);

        setIssues(issueRes.data || []);
        setProjects(projectRes.data || []);

      } catch (err) {
        console.error("KANBAN ERROR:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ PROJECT FILTER
  const filteredIssues = project
    ? issues.filter(i => String(i.project?.id) === String(project))
    : issues;

  // ✅ STATUS FIX
  const normalize = (status) => {
    if (!status) return "";
    return status.replace(" ", "_").toUpperCase();
  };

  // 🎨 COLORS
  const getColor = (status) => {
    switch (status) {
      case "SUBMITTED": return "border-gray-300";
      case "ASSIGNED": return "border-blue-300";
      case "IN_PROGRESS": return "border-yellow-300";
      case "TESTING": return "border-purple-300";
      case "DONE": return "border-green-300";
      default: return "";
    }
  };

  // ✅ DRAG DROP
  const onDrop = async (status) => {
    if (!draggedId) return;

    try {

      await API.put(`/issues/${draggedId}/status`, { status });

      setIssues(prev =>
        prev.map(i =>
          i.id === draggedId ? { ...i, status } : i
        )
      );

    } catch (err) {
      console.error("Full error:", err);

      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed ❌";

      alert(msg);
    }
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-2">Kanban Board</h1>
      <p className="text-gray-500 mb-6">
        Drag and drop issues across workflow stages
      </p>

      {/* PROJECT DROPDOWN */}
      <select
        value={project}
        onChange={(e) => setProject(e.target.value)}
        className="border p-2 rounded mb-6"
      >
        <option value="">All Projects</option>
        {projects.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* BOARD */}
      <div className="grid grid-cols-5 gap-4">

        {columns.map(status => {

          const columnIssues = filteredIssues.filter(
            i => normalize(i.status) === status
          );

          return (
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(status)}
              className={`bg-white rounded-xl shadow p-3 border-t-4 ${getColor(status)}`}
            >

              <h3 className="font-semibold mb-3 text-sm">
                {status.replace("_", " ")} ({columnIssues.length})
              </h3>

              {columnIssues.length === 0 ? (
                <p className="text-gray-400 text-sm text-center">
                  No issues
                </p>
              ) : (
                columnIssues.map(issue => (
                  <div
                    key={issue.id}
                    draggable
                    onDragStart={() => setDraggedId(issue.id)}
                    className="bg-gray-50 p-2 rounded mb-2 text-sm shadow cursor-move hover:bg-gray-100"
                  >

                    <p className="font-medium">{issue.title}</p>

                    <p className="text-xs text-gray-500">
                      {issue.priority}
                    </p>

                    <p className="text-xs text-gray-400">
                      {issue.project?.name}
                    </p>

                  </div>
                ))
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default Kanban;