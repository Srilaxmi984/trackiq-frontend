import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import axios from "axios";

export default function ReporterFeedback() {

  const [issues, setIssues] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  const [submitted, setSubmitted] = useState([]); // ⭐ VIEW PART

  // ✅ FETCH REPORTER ISSUES (CORRECT API)
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

        const data = res.data || [];

        // ✅ PENDING FEEDBACK
        const pending = data.filter(
          (i) => i.status === "DONE" && !i.feedbackGiven
        );

        // ✅ SUBMITTED FEEDBACK
        const submittedData = data.filter(
          (i) => i.feedbackGiven === true
        );

        setIssues(pending);
        setSubmitted(submittedData);

      } catch (err) {
        console.error(err);
      }
    };

    fetchIssues();
  }, []);

  const handleRating = (id, value) => {
    setRatings({ ...ratings, [id]: value });
  };

  // ✅ SUBMIT
  const handleSubmit = async (issue) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/api/issues/feedback/${issue.id}`,
        null,
        {
          params: {
            feedback: comments[issue.id],
            rating: ratings[issue.id]
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Feedback submitted ✅");

      // 🔥 MOVE TO SUBMITTED LIST
      setIssues(prev => prev.filter(i => i.id !== issue.id));

      setSubmitted(prev => [
        {
          ...issue,
          feedback: comments[issue.id],
          rating: ratings[issue.id],
          feedbackGiven: true
        },
        ...prev
      ]);

    } catch (err) {
      console.error(err);
      alert("Failed ❌");
    }
  };

  return (
    <div>

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-1">Feedback</h1>
      <p className="text-gray-500 mb-6">
        Give feedback for resolved issues
      </p>

      {/* 🔥 GIVE FEEDBACK */}
      <div className="space-y-4 mb-8">

        <h2 className="font-semibold">Pending Feedback</h2>

        {issues.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-gray-400 text-center">
            No resolved issues available
          </div>
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="bg-white p-5 rounded-xl shadow">

              <h2 className="font-semibold text-lg">{issue.title}</h2>

              <p className="text-sm text-gray-500 mb-3">
                {issue.project?.name}
              </p>

              {/* ⭐ RATING */}
              <div className="flex gap-1 mt-3">
                {[1,2,3,4,5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    onClick={() => handleRating(issue.id, star)}
                    className={`cursor-pointer ${
                      ratings[issue.id] >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* COMMENT */}
              <textarea
                className="w-full border p-2 rounded mt-3"
                placeholder="Write feedback..."
                onChange={(e) =>
                  setComments({
                    ...comments,
                    [issue.id]: e.target.value
                  })
                }
              />

              <button
                onClick={() => handleSubmit(issue)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit Feedback
              </button>

            </div>
          ))
        )}

      </div>

      {/* 🔥 VIEW SUBMITTED FEEDBACK */}
      <div className="bg-white p-5 rounded-xl shadow">

        <h2 className="font-semibold mb-4">My Submitted Feedback</h2>

        {submitted.length === 0 ? (
          <p className="text-gray-400 text-center">
            No feedback submitted yet
          </p>
        ) : (
          <div className="space-y-3">
            {submitted.map((i) => (
              <div key={i.id} className="border p-3 rounded">

                <p className="font-semibold">{i.title}</p>

                <p className="text-yellow-600 text-sm">
                  ⭐ {i.rating || 0}
                </p>

                <p className="text-gray-600 text-sm mt-1">
                  {i.feedback}
                </p>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}