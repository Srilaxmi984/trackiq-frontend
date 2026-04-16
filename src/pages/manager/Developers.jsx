import { useState, useEffect } from "react";
import API from "../../services/api";
import { Mail, Phone, User, Lock } from "lucide-react";

const Developers = () => {

  const [showForm, setShowForm] = useState(false);
  const [developers, setDevelopers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  // ✅ FETCH DEVELOPERS
  const fetchDevelopers = async () => {
    try {
      const res = await API.get("/users/developers");
      setDevelopers(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ✅ CREATE DEVELOPER
  const addDeveloper = async () => {
    if (!form.name || !form.email || !form.password) return;

    try {
      await API.post("/auth/signup", {
        ...form,
        role: "DEVELOPER"
      });

      setForm({ name: "", email: "", password: "", phone: "" });
      setShowForm(false);

      fetchDevelopers(); // refresh list
    } catch (err) {
      alert(err.response?.data || "Failed ❌");
    }
  };

  // ✅ LOAD DATA
  useEffect(() => {
    (async () => {
      await fetchDevelopers();
    })();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="font-sans">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Developers</h1>
          <p className="text-gray-500">Manage developer accounts</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:opacity-90"
        >
          + Create Developer
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-5 rounded-xl shadow mb-6 grid grid-cols-2 gap-4 border">

          <div className="flex items-center border rounded px-2">
            <User size={16} className="text-gray-400" />
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="p-2 w-full outline-none"
            />
          </div>

          <div className="flex items-center border rounded px-2">
            <Mail size={16} className="text-gray-400" />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="p-2 w-full outline-none"
            />
          </div>

          <div className="flex items-center border rounded px-2">
            <Lock size={16} className="text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="p-2 w-full outline-none"
            />
          </div>

          <div className="flex items-center border rounded px-2">
            <Phone size={16} className="text-gray-400" />
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="p-2 w-full outline-none"
            />
          </div>

          <div className="col-span-2 flex gap-3 mt-2">
            <button
              onClick={addDeveloper}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
            >
              Create
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>

        </div>
      )}

      {/* LIST */}
      {developers.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No developers added yet
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {developers.map(dev => (
            <div
              key={dev.id}
              className="bg-white p-4 rounded-xl shadow border hover:shadow-md transition"
            >

              <h2 className="font-semibold text-gray-800">{dev.name}</h2>

              <p className="text-sm text-gray-500">{dev.email}</p>

              <p className="text-sm text-gray-500">{dev.phone || "-"}</p>

              <p className="text-xs text-gray-400 mt-2">
                Joined {dev.createdAt?.split("T")[0] || "-"}
              </p>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Developers;