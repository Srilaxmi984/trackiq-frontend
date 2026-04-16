import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Kanban() {

  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [draggedId, setDraggedId] = useState(null);

  const userId = localStorage.getItem("userId");

  const columns = ["ASSIGNED", "IN_PROGRESS", "TESTING", "DONE"];

  // ✅ FETCH PROJECTS
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  // ✅ FETCH ISSUES (FIXED HERE ONLY)
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        if (!selectedProject) return;

        const res = await API.get("/issues"); // ✅ FIX

        const filtered = (res.data || []).filter(
          i => i.project?.id == selectedProject
        );

        setIssues(filtered);

      } catch (err) {
        console.error("KANBAN ERROR:", err);
      }
    };

    fetchIssues();
  }, [selectedProject]);

  const normalize = (status) => {
    if (!status) return "";
    return status.replace(" ", "_").toUpperCase();
  };

  const getColor = (status) => {
    switch (status) {
      case "ASSIGNED": return "border-blue-300";
      case "IN_PROGRESS": return "border-yellow-300";
      case "TESTING": return "border-purple-300";
      case "DONE": return "border-green-300";
      default: return "border-gray-300";
    }
  };

  const getCardColor = (issue) => {
    if (issue.assignedTo?.id == userId) {
      return "bg-blue-100 border border-blue-400";
    }
    return "bg-gray-100 opacity-70";
  };

  const onDrop = async (status) => {
    if (!draggedId) return;

    const draggedIssue = issues.find(i => i.id === draggedId);

    if (draggedIssue?.assignedTo?.id != userId) {
      alert("You can only move your own issues ❌");
      return;
    }

    try {
      await API.put(`/issues/${draggedId}/status`, { status });

      setIssues(prev =>
        prev.map(i =>
          i.id === draggedId ? { ...i, status } : i
        )
      );

    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="font-sans">

      <h1 className="text-2xl font-bold mb-2">Project Kanban Board</h1>
      <p className="text-gray-500 mb-4">
        Analyze all issues (your issues highlighted 🔵)
      </p>

      {/* PROJECT DROPDOWN */}
      <div className="mb-6">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {!selectedProject ? (
        <p className="text-gray-400 text-center">
          Please select a project
        </p>
      ) : (

        <div className="grid grid-cols-4 gap-4">

          {columns.map(status => {

            const columnIssues = issues.filter(
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
                      draggable={issue.assignedTo?.id == userId}
                      onDragStart={() => setDraggedId(issue.id)}
                      className={`p-2 rounded mb-2 text-sm shadow cursor-move hover:bg-gray-100 ${getCardColor(issue)}`}
                    >
                      <p className="font-medium">{issue.title}</p>

                      <p className="text-xs text-gray-500">
                        {issue.priority}
                      </p>

                      <p className="text-xs text-gray-400">
                        {issue.project?.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        Assigned: {issue.assignedTo?.name || "N/A"}
                      </p>
                    </div>
                  ))
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}