import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Users, Smile, Clock } from "lucide-react";

const Feedback = () => {

  const [issues, setIssues] = useState([]);

  const [avgRating, setAvgRating] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [pending, setPending] = useState(0);

  const [devStats, setDevStats] = useState([]);

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:8080/api/issues",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = res.data || [];
        setIssues(data);

        // ✅ FILTER FEEDBACK
        const feedbackList = data.filter(i => i.feedbackGiven);

        const total = feedbackList.length;
        setTotalFeedback(total);

        // ✅ AVG RATING
        const avg =
          total === 0
            ? 0
            : (
                feedbackList.reduce((sum, i) => sum + (i.rating || 0), 0) /
                total
              ).toFixed(1);

        setAvgRating(avg);

        // ✅ SATISFACTION (rating >= 4)
        const satisfied = feedbackList.filter(i => i.rating >= 4).length;

        const satPercent =
          total === 0 ? 0 : Math.round((satisfied / total) * 100);

        setSatisfaction(satPercent + "%");

        // ✅ PENDING (DONE but no feedback)
        const pendingCount = data.filter(
          i => i.status === "DONE" && !i.feedbackGiven
        ).length;

        setPending(pendingCount);

        // ✅ DEVELOPER PERFORMANCE
        const devMap = {};

        feedbackList.forEach(i => {
          const dev = i.assignedTo?.name || "Unknown";

          if (!devMap[dev]) {
            devMap[dev] = { total: 0, sum: 0 };
          }

          devMap[dev].total += 1;
          devMap[dev].sum += i.rating || 0;
        });

        const devData = Object.keys(devMap).map(dev => ({
          name: dev,
          avg: (devMap[dev].sum / devMap[dev].total).toFixed(1),
          total: devMap[dev].total
        }));

        setDevStats(devData);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-2">Feedback Analytics</h1>
      <p className="text-gray-500 mb-6">
        Insights based on user feedback
      </p>

      {/* 🔥 TOP CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <Card title="Avg Rating" value={avgRating || "--"} icon={<Star className="text-yellow-500" />} />
        <Card title="Total Feedback" value={totalFeedback} icon={<Users className="text-blue-500" />} />
        <Card title="Satisfaction" value={satisfaction} icon={<Smile className="text-green-500" />} />
        <Card title="Pending" value={pending} icon={<Clock className="text-red-500" />} />

      </div>

      {/* 🔥 DEVELOPER PERFORMANCE */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">

        <h2 className="font-semibold mb-4">Developer Performance</h2>

        {devStats.length === 0 ? (
          <Empty text="No performance data yet" />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="text-left p-2">Developer</th>
                <th className="text-left p-2">Avg Rating</th>
                <th className="text-left p-2">Total Issues</th>
              </tr>
            </thead>
            <tbody>
              {devStats.map((d, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{d.name}</td>
                  <td className="p-2 text-yellow-600 font-semibold">
                    ⭐ {d.avg}
                  </td>
                  <td className="p-2">{d.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {/* 🔥 RECENT FEEDBACK */}
      <div className="bg-white p-5 rounded-xl shadow">

        <h2 className="font-semibold mb-4">Recent Feedback</h2>

        {issues.filter(i => i.feedbackGiven).length === 0 ? (
          <Empty text="No feedback yet" />
        ) : (
          <div className="space-y-3">
            {issues
              .filter(i => i.feedbackGiven)
              .slice(0, 5)
              .map(i => (
                <div key={i.id} className="border p-3 rounded">

                  <p className="font-semibold">{i.title}</p>

                  <p className="text-sm text-gray-500">
                    By: {i.reporter?.name}
                  </p>

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
};

export default Feedback;


// 🔥 COMPONENTS

const Card = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold mt-1">{value}</h2>
    </div>
    <div className="text-2xl">{icon}</div>
  </div>
);

const Empty = ({ text }) => (
  <div className="text-gray-400 text-center py-6">
    {text}
  </div>
);