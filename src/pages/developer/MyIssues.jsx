import { useState, useEffect } from "react";
import axios from "axios";

export default function MyIssues() {

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [solveModal, setSolveModal] = useState(null);
  const [solutionText, setSolutionText] = useState("");
  const [solutionFile, setSolutionFile] = useState(null);

  // ✅ FORMAT DATE
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);

    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // ✅ FETCH
  useEffect(() => {
    const fetchIssues = async () => {
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
        console.error(err);
      }
    };

    fetchIssues();
  }, []);

  // 🎨 STATUS
  const getStatusColor = (status) => {
    switch (status) {
      case "ASSIGNED": return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-700";
      case "TESTING": return "bg-purple-100 text-purple-700";
      case "DONE": return "bg-green-100 text-green-700";
      default: return "bg-gray-100";
    }
  };

  // 🎨 PRIORITY
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "LOW": return "text-green-600";
      case "MEDIUM": return "text-yellow-600";
      case "HIGH": return "text-orange-600";
      case "CRITICAL": return "text-red-600 font-semibold";
      default: return "";
    }
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-1">My Issues</h1>
      <p className="text-gray-500 mb-6">
        View and update your assigned issues
      </p>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Project</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Updated</th>
              <th className="p-3 text-left">View</th>
              <th className="p-3 text-left">Solve</th>
            </tr>
          </thead>

          <tbody>
            {issues.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-400">
                  No issues assigned
                </td>
              </tr>
            ) : (
              issues.map((i) => (
                <tr key={i.id} className="border-t hover:bg-gray-50">

                  <td className="p-3 font-medium">{i.title}</td>
                  <td className="p-3">{i.project?.name}</td>

                  <td className={`p-3 ${getPriorityColor(i.priority)}`}>
                    {i.priority}
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(i.status)}`}>
                      {i.status}
                    </span>
                  </td>

                  <td className="p-3 text-xs text-gray-500">
                    {formatDate(i.updatedAt)}
                  </td>

                  {/* VIEW */}
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedIssue(i)}
                      className="bg-gray-800 text-white px-3 py-1 rounded text-xs hover:bg-black"
                    >
                      View
                    </button>
                  </td>

                  {/* SOLVE */}
                  <td className="p-3">
                    <button
                      onClick={() => setSolveModal(i)}
                      className={`px-3 py-1 rounded text-xs ${
                        i.status === "DONE"
                          ? "bg-green-600 text-white"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {i.status === "DONE" ? "Solved" : "Solve"}
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* ISSUE DETAILS */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <button onClick={() => setSelectedIssue(null)} className="absolute top-5 right-5 text-white text-3xl">✕</button>

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-3xl">
            <h2 className="text-xl font-bold mb-4">Issue Details</h2>

            <p><b>Title:</b> {selectedIssue.title}</p>
            <p><b>Description:</b> {selectedIssue.description || "N/A"}</p>
            <p><b>Reported At:</b> {formatDate(selectedIssue.createdAt || selectedIssue.updatedAt)}</p>

            {selectedIssue.fileUrl && (
              <img
                src={`http://localhost:8080${selectedIssue.fileUrl}`}
                onClick={() => setSelectedImage(`http://localhost:8080${selectedIssue.fileUrl}`)}
                className="w-32 h-32 mt-3 cursor-pointer rounded"
              />
            )}
          </div>
        </div>
      )}

      {/* SOLVE MODAL */}
      {solveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

          <button onClick={() => setSolveModal(null)} className="absolute top-5 right-5 text-white text-3xl">✕</button>

          <div className="bg-white p-6 rounded-xl w-[90%] max-w-xl">

            <h2 className="font-bold mb-4">
              {solveModal.status === "DONE" ? "View Solution" : "Resolve Issue"}
            </h2>

            {solveModal.status !== "DONE" ? (
              <>
                <textarea
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  className="w-full border p-2 mb-3"
                />

                <input type="file" onChange={(e) => setSolutionFile(e.target.files[0])} />

                <button
                  onClick={async () => {
                    const token = localStorage.getItem("token");

                    const formData = new FormData();
                    formData.append("notes", solutionText);
                    if (solutionFile) formData.append("file", solutionFile);

                    await axios.post(
                      `http://localhost:8080/api/issues/resolve/${solveModal.id}`,
                      formData,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    setIssues(prev =>
                      prev.map(item =>
                        item.id === solveModal.id
                          ? { ...item, status: "DONE" }
                          : item
                      )
                    );

                    setSolveModal(null);
                  }}
                  className="bg-green-600 text-white px-4 py-2 mt-3 rounded"
                >
                  Submit
                </button>
              </>
            ) : (
              <>
                <p><b>Notes:</b> {solveModal.resolutionNotes || "No notes"}</p>

                {/* ✅ CLICKABLE SOLUTION IMAGE */}
                {solveModal.resolutionFileUrl && (
                  <img
                    src={`http://localhost:8080${solveModal.resolutionFileUrl}`}
                    onClick={() => setSelectedImage(`http://localhost:8080${solveModal.resolutionFileUrl}`)}
                    className="w-40 mt-3 rounded border cursor-pointer hover:scale-105"
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ✅ FULL SCREEN IMAGE VIEW */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">

          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 text-white text-3xl"
          >
            ✕
          </button>

          <img
            src={selectedImage}
            className="max-w-[90%] max-h-[90%] rounded"
          />
        </div>
      )}

    </div>
  );
}