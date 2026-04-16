import { useState, useEffect } from "react";
import axios from "axios";

export default function MyIssues() {

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [feedbackModal, setFeedbackModal] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);

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
          `http://localhost:8080/api/issues/reporter/${userId}`,
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
              <th className="p-3 text-left">Feedback</th>
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

                  {/* VIEW BUTTON */}
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedIssue(i)}
                      className="bg-gray-800 text-white px-3 py-1 rounded text-xs"
                    >
                      View
                    </button>
                  </td>

                  {/* FEEDBACK BUTTON */}
                  <td className="p-3">
                    {i.status === "DONE" && (
                      i.feedbackGiven ? (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-600 px-3 py-1 rounded text-xs"
                        >
                          Submitted
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setFeedbackModal(i);
                            setRating(0);
                            setFeedbackText("");
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Feedback
                        </button>
                      )
                    )}
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* VIEW MODAL */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

          <button
            onClick={() => setSelectedIssue(null)}
            className="absolute top-5 right-5 text-white text-3xl"
          >✕</button>

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-3xl max-h-[90%] overflow-y-auto">

            <h2 className="text-lg font-bold text-blue-600 mb-3">Issue Details</h2>

            <p><b>Title:</b> {selectedIssue.title}</p>
            <p><b>Description:</b> {selectedIssue.description || "N/A"}</p>
            <p><b>Project:</b> {selectedIssue.project?.name}</p>
            <p><b>Priority:</b> {selectedIssue.priority}</p>
            <p><b>Status:</b> {selectedIssue.status}</p>
            <p><b>Assigned To:</b> {selectedIssue.assignedTo?.name}</p>

            <p className="text-sm text-gray-500 mt-2">
              <b>Updated:</b> {formatDate(selectedIssue.updatedAt)}
            </p>

            {/* REPORTER IMAGE */}
            {selectedIssue.fileUrl && (
              <img
                src={`http://localhost:8080${selectedIssue.fileUrl}`}
                onClick={() => setSelectedImage(`http://localhost:8080${selectedIssue.fileUrl}`)}
                className="w-32 mt-3 cursor-pointer"
              />
            )}

            {/* DEVELOPER SOLUTION */}
            {selectedIssue.status === "DONE" && (
              <div className="mt-5">
                <h3 className="text-green-600 font-semibold">Developer Solution</h3>

                <p>{selectedIssue.resolutionNotes || "No notes provided"}</p>

                {selectedIssue.resolutionFileUrl && (
                  <img
                    src={`http://localhost:8080${selectedIssue.resolutionFileUrl}`}
                    onClick={() => setSelectedImage(`http://localhost:8080${selectedIssue.resolutionFileUrl}`)}
                    className="w-40 mt-3 cursor-pointer"
                  />
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* IMAGE VIEW */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 text-white text-3xl"
          >✕</button>

          <img src={selectedImage} className="max-w-[90%] max-h-[90%]" />
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

          <button
            onClick={() => setFeedbackModal(null)}
            className="absolute top-5 right-5 text-white text-3xl"
          >✕</button>

          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">

            <h2 className="font-bold mb-3 text-blue-600">Give Feedback</h2>

            {/* STARS */}
            <div className="flex gap-1 mb-3 text-2xl">
              {[1,2,3,4,5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full border p-2 mb-3"
              placeholder="Enter feedback..."
            />

            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");

                  await axios.put(
                    `http://localhost:8080/api/issues/feedback/${feedbackModal.id}`,
                    null,
                    {
                      params: {
                        feedback: feedbackText,
                        rating: rating
                      },
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    }
                  );

                  setIssues(prev =>
                    prev.map(issue =>
                      issue.id === feedbackModal.id
                        ? { ...issue, feedbackGiven: true }
                        : issue
                    )
                  );

                  alert("Feedback submitted ✅");

                  setFeedbackModal(null);
                  setFeedbackText("");
                  setRating(0);

                } catch (err) {
                  console.error(err);
                  alert("Failed ❌");
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>

          </div>
        </div>
      )}

    </div>
  );
}