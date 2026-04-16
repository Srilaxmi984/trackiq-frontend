import { useState, useEffect } from "react";
import { Folder, Trash2, Plus } from "lucide-react";
import API from "../../services/api";

const Projects = () => {

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // 🔥 FETCH PROJECTS (DEFINE FIRST)
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // 🔥 CALL AFTER DEFINE
  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      try {
        const res = await API.get("/projects");
        if (isMounted) setProjects(res.data);
      } catch (err) {
        if (isMounted) console.error("Fetch error:", err);
      }
    };
    loadProjects();
    return () => { isMounted = false; };
  }, []);

  // 🔥 ADD PROJECT
  const addProject = async () => {
    if (!name.trim()) return;

    try {
      await API.post("/projects", {
        name,
        description
      });

      setName("");
      setDescription("");

      fetchProjects(); // refresh list
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // 🔥 DELETE PROJECT
  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-500">Manage all projects</p>
        </div>
      </div>

      {/* ADD PROJECT */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">

        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Plus size={16} /> Add Project
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded outline-none"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded outline-none"
          />

        </div>

        <button
          onClick={addProject}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add
        </button>

      </div>

      {/* PROJECT LIST */}
      <div className="bg-white p-5 rounded-xl shadow">

        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Folder size={16} /> All Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            No projects yet
          </p>
        ) : (
          <div className="space-y-3">

            {projects.map(project => (
              <div
                key={project.id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >

                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-500">
                    {project.description || "No description"}
                  </p>
                </div>

                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Projects;