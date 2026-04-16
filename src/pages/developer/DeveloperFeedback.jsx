import { useEffect, useState } from "react";
import axios from "axios";

export default function DeveloperFeedback() {

  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const res = await axios.get(
          "http://localhost:8080/api/issues",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = res.data || [];

        // ✅ FILTER FOR THIS DEVELOPER
        const filtered = data.filter(
          (i) =>
            i.assignedTo?.id == userId &&
            i.feedbackGiven === true
        );

        setFeedbacks(filtered);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>

      <h1 className="text-2xl font-bold mb-2">Feedback</h1>
      <p className="text-gray-500 mb-6">
        Feedback given by reporters on your resolved issues
      </p>

      <div className="bg-white p-5 rounded-xl shadow">

        {feedbacks.length === 0 ? (
          <p className="text-gray-400 text-center">
            No feedback received yet
          </p>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((i) => (
              <div key={i.id} className="border p-3 rounded">

                <p className="font-semibold">{i.title}</p>

                <p className="text-sm text-gray-500">
                  Project: {i.project?.name}
                </p>

                <p className="text-sm text-gray-500">
                  Reporter: {i.reportedBy?.name}
                </p>

                <p className="text-yellow-600 text-sm mt-1">
                  ⭐ {i.rating || 0}
                </p>

                <p className="text-gray-600 text-sm mt-1">
                  {i.feedback || "No comment"}
                </p>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}