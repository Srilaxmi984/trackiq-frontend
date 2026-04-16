import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock } from "lucide-react";
import API from "../../services/api";

const Profile = () => {

  const userId = localStorage.getItem("userId"); // ✅ existing system

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [initialData, setInitialData] = useState({});

  // ✅ LOAD USER DATA (COMMON API)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/${userId}`);

        const data = {
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          password: ""
        };

        setForm(data);
        setInitialData(data);

      } catch (err) {
        console.error("PROFILE ERROR:", err);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 RESET
  const handleReset = () => {
    setForm(initialData);
  };

  // 🔥 SAVE (COMMON API)
  const handleSave = async () => {
    try {
      await API.put(`/users/${userId}`, form); // ✅ same update API

      alert("Profile updated ✅");

    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Failed ❌");
    }
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <p className="text-gray-500 mb-6">
        Update your personal details
      </p>

      <div className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4">

        {/* NAME */}
        <div className="flex items-center border rounded px-2">
          <User size={16} className="text-gray-400" />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="p-2 w-full outline-none"
            placeholder="Full Name"
          />
        </div>

        {/* EMAIL */}
        <div className="flex items-center border rounded px-2">
          <Mail size={16} className="text-gray-400" />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="p-2 w-full outline-none"
            placeholder="Email"
          />
        </div>

        {/* PHONE */}
        <div className="flex items-center border rounded px-2">
          <Phone size={16} className="text-gray-400" />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="p-2 w-full outline-none"
            placeholder="Phone"
          />
        </div>

        {/* PASSWORD */}
        <div className="flex items-center border rounded px-2">
          <Lock size={16} className="text-gray-400" />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="p-2 w-full outline-none"
            placeholder="New Password"
          />
        </div>

        {/* BUTTONS */}
        <div className="col-span-2 flex gap-4 mt-4">

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>

          <button
            onClick={handleReset}
            className="border px-5 py-2 rounded hover:bg-gray-100"
          >
            Reset
          </button>

        </div>

      </div>

    </div>
  );
};

export default Profile;