import { useState, useEffect } from "react";
import axios from "axios";

const Issues = () => {

  const [filter, setFilter] = useState("ALL");
  const [issues, setIssues] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [selectedDev, setSelectedDev] = useState({});
  const [selectedIssue, setSelectedIssue] = useState(null); // ✅ ADDED

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:8080/api/issues", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const devRes = await axios.get("http://localhost:8080/api/users/developers", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setIssues(res.data || []);
        setDevelopers(devRes.data || []);

      } catch (err) {
        console.error(err);
      }
    };

    fetchIssues();
  }, []);

  // FILTER
  const filteredIssues =
    filter === "ALL"
      ? issues
      : issues.filter(i => i.status === filter);

  // FILTER STYLE
  const getFilterStyle = (f) => {
    const base = "px-4 py-1 rounded-full text-sm font-medium transition";

    if (filter === f) {
      switch (f) {
        case "SUBMITTED": return `${base} bg-gray-600 text-white`;
        case "ASSIGNED": return `${base} bg-blue-600 text-white`;
        case "IN_PROGRESS": return `${base} bg-yellow-500 text-white`;
        case "TESTING": return `${base} bg-purple-600 text-white`;
        case "DONE": return `${base} bg-green-600 text-white`;
        default: return `${base} bg-black text-white`;
      }
    }

    return `${base} bg-gray-100 text-gray-600 hover:bg-gray-200`;
  };

  // STATUS COLOR
  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED": return "bg-gray-200 text-gray-700";
      case "ASSIGNED": return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-700";
      case "TESTING": return "bg-purple-100 text-purple-700";
      case "DONE": return "bg-green-100 text-green-700";
      default: return "";
    }
  };

  // PRIORITY COLOR
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "CRITICAL": return "text-red-600 font-semibold";
      case "HIGH": return "text-orange-500 font-semibold";
      case "MEDIUM": return "text-blue-500 font-medium";
      case "LOW": return "text-gray-500";
      default: return "";
    }
  };

  // DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filters = ["ALL", "SUBMITTED", "ASSIGNED", "IN_PROGRESS", "TESTING", "DONE"];

  return (
    <div className="font-sans">

      <h1 className="text-2xl font-bold mb-2">Issues</h1>
      <p className="text-gray-500 mb-6">Manage and assign all issues</p>

      {/* FILTERS */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={getFilterStyle(f)}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-5">

        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No issues yet 🚀
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">

            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Project</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Assigned To</th>
                <th className="p-3 text-left">Updated</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredIssues.map((issue) => {

                const devId = selectedDev[issue.id] || "";

                return (
                  <tr key={issue.id} className="border-t hover:bg-gray-50">

                    <td className="p-3 font-medium">{issue.title}</td>
                    <td className="p-3">{issue.project?.name || "-"}</td>
                    <td className="p-3 text-gray-500">{issue.category}</td>

                    <td className={`p-3 ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(issue.status)}`}>
                        {issue.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="p-3 text-blue-600 font-medium">
                      {issue.assignedTo?.name || "Unassigned"}
                    </td>

                    <td className="p-3 text-gray-400 text-xs">
                      {formatDate(issue.updatedAt)}
                    </td>

                    {/* ACTION */}
                    <td className="p-3 flex gap-2 items-center">

                      {/* 🔥 VIEW BUTTON */}
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="bg-gray-700 text-white px-3 py-1 rounded text-xs"
                      >
                        View
                      </button>

                      {/* DROPDOWN */}
                      <select
                        disabled={!!issue.assignedTo}
                        className="border px-2 py-1 rounded text-xs"
                        value={devId}
                        onChange={(e) =>
                          setSelectedDev({
                            ...selectedDev,
                            [issue.id]: e.target.value
                          })
                        }
                      >
                        <option value="">Select Dev</option>
                        {developers.map(dev => (
                          <option key={dev.id} value={dev.id}>
                            {dev.name}
                          </option>
                        ))}
                      </select>

                      {/* BUTTON */}
                      {issue.assignedTo ? (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-600 px-3 py-1 rounded text-xs"
                        >
                          Assigned
                        </button>
                      ) : (
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");

                              if (!devId) {
                                alert("Select developer first ❌");
                                return;
                              }

                              await axios.put(
                                `http://localhost:8080/api/issues/${issue.id}/assign`,
                                { developerId: devId },
                                { headers: { Authorization: `Bearer ${token}` } }
                              );

                              alert("Assigned ✅");

                              setIssues(prev =>
                                prev.map(i =>
                                  i.id === issue.id
                                    ? {
                                        ...i,
                                        assignedTo: developers.find(d => d.id == devId),
                                        status: "ASSIGNED",
                                        updatedAt: new Date().toISOString()
                                      }
                                    : i
                                )
                              );

                            } catch (err) {
                              console.error(err);
                              alert("Failed ❌");
                            }
                          }}
                        >
                          Assign
                        </button>
                      )}

                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        )}

      </div>

      {/* 🔥 MODAL */}
      {/* 🔥 MODAL */}
{selectedIssue && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

    {/* CLOSE */}
    <button
      onClick={() => setSelectedIssue(null)}
      className="absolute top-5 right-5 text-white text-3xl"
    >
      ✕
    </button>

    <div className="bg-white rounded-xl p-6 w-[90%] max-w-3xl max-h-[90%] overflow-y-auto">

      <h2 className="text-xl font-bold mb-4">Issue Details</h2>

      <p><b>Title:</b> {selectedIssue.title}</p>
      <p><b>Description:</b> {selectedIssue.description || "N/A"}</p>
      <p><b>Category:</b> {selectedIssue.category}</p>
      <p><b>Priority:</b> {selectedIssue.priority}</p>
      <p><b>Status:</b> {selectedIssue.status}</p>
      <p><b>Steps:</b> {selectedIssue.stepsToReproduce || "N/A"}</p>
      <p><b>Impact:</b> {selectedIssue.impact || "N/A"}</p>

      {/* ✅ FIXED DATE */}
      <p>
        <b>Reported At:</b>{" "}
        {formatDate(selectedIssue.createdAt || selectedIssue.updatedAt)}
      </p>

      {/* ✅ CLICKABLE IMAGE */}
      {selectedIssue.fileUrl && (
        <div className="mt-4">
          <p className="font-semibold mb-2">Attachment:</p>

          <img
            src={`http://localhost:8080${selectedIssue.fileUrl}`}
            alt="issue"
            onClick={() =>
              setSelectedIssue({
                ...selectedIssue,
                zoom: true
              })
            }
            className="w-32 h-32 object-cover rounded border cursor-pointer hover:scale-105 transition"
          />
        </div>
      )}

    </div>

    {/* 🔥 IMAGE ZOOM INSIDE SAME SCREEN */}
    {selectedIssue.zoom && (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">

        <button
          onClick={() =>
            setSelectedIssue({
              ...selectedIssue,
              zoom: false
            })
          }
          className="absolute top-5 right-5 text-white text-3xl"
        >
          ✕
        </button>

        <img
          src={`http://localhost:8080${selectedIssue.fileUrl}`}
          alt="full"
          className="max-w-[90%] max-h-[90%] rounded-lg"
        />
      </div>
    )}

  </div>
)}

    </div>
  );
};

export default Issues;