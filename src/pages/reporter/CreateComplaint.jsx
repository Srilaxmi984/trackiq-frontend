import { useEffect, useState } from "react";
import axios from "axios";

export default function CreateComplaint() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    category: "BUG",
    priority: "MEDIUM",
    steps: "",
    impact: "",
    file: null,
  });

  // ✅ FETCH PROJECTS
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:8080/api/projects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProjects(res.data);
      } catch (err) {
        console.error("Project fetch error:", err);
      }
    };

    fetchProjects();
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ HANDLE FILE
  const handleFile = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.projectId) {
      setError("Title, Description and Project are required");
      return;
    }

    setError("");

    try {
      const token = localStorage.getItem("token");
      const reporterId = localStorage.getItem("userId");

      // 🔥 STEP 1: CREATE ISSUE
      const res = await axios.post(
        `http://localhost:8080/api/issues/${reporterId}/${form.projectId}`,
        {
          title: form.title,
          description: form.description,
          priority: form.priority,
          category: form.category,
          stepsToReproduce: form.steps,
          impact: form.impact,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 STEP 2: FILE UPLOAD (✅ FIXED URL)
      if (form.file) {
        const formData = new FormData();
        formData.append("file", form.file);

        await axios.post(
          `http://localhost:8080/api/issues/${res.data.id}/upload`, // ✅ CORRECT
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      alert("Complaint submitted successfully ✅");

      // RESET
      setForm({
        title: "",
        description: "",
        projectId: "",
        category: "BUG",
        priority: "MEDIUM",
        steps: "",
        impact: "",
        file: null,
      });

    } catch (err) {
      console.error(err);
      alert("Error submitting complaint ❌");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      
      <h1 className="text-2xl font-bold mb-2">Submit Complaint</h1>
      <p className="text-gray-500 mb-6">
        Fill out the structured form to report an issue
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* TITLE */}
        <div>
          <label className="font-medium">Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-medium">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* PROJECT + CATEGORY */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Project *</label>
            <select
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            >
              <option value="BUG">Bug</option>
              <option value="FEATURE">Feature</option>
              <option value="PERFORMANCE">Performance</option>
              <option value="SECURITY">Security</option>
              <option value="UI_UX">UI/UX</option>
            </select>
          </div>
        </div>

        {/* PRIORITY */}
        <div>
          <label className="font-medium">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          >
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
          </select>
        </div>

        {/* STEPS */}
        <textarea
          name="steps"
          value={form.steps}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Steps..."
        />

        {/* IMPACT */}
        <input
          name="impact"
          value={form.impact}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Impact"
        />

        {/* FILE */}
        <input type="file" onChange={handleFile} />

        <button className="w-full bg-blue-600 text-white p-3 rounded">
          Submit Complaint
        </button>
      </form>
    </div>
  );
}