import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [originalData, setOriginalData] = useState({});

  // ✅ FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const res = await axios.get(
        `http://localhost:8080/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const user = res.data;

      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: ""
      });

      setOriginalData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });

    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ VALIDATION FUNCTION
  const validate = () => {
    if (!form.name.trim()) {
      alert("Name is required");
      return false;
    }

    if (!form.email.includes("@")) {
      alert("Enter valid email");
      return false;
    }

    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      alert("Phone must be 10 digits");
      return false;
    }

    if (form.password && form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  // ✅ SAVE
  const handleSave = async () => {

    if (!validate()) return; // 🔥 validation check

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      await axios.put(
        `http://localhost:8080/api/users/${userId}`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password || null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Profile updated ✅");

      setOriginalData({
        name: form.name,
        email: form.email,
        phone: form.phone
      });

      // ✅ CLEAR PASSWORD AFTER SAVE
      setForm((prev) => ({
        ...prev,
        password: ""
      }));

    } catch (err) {
      console.error("Save error:", err);
      alert("Error updating profile ❌");
    }
  };

  // ✅ RESET
  const handleReset = () => {
    setForm({
      ...originalData,
      password: ""
    });
  };

  return (
    <div className="max-w-4xl">

      <h1 className="text-2xl font-bold mb-1">Profile</h1>
      <p className="text-gray-500 mb-6">
        Update your personal details
      </p>

      <div className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4">

        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          disabled   // 🔥 industry standard
          className="border p-2 rounded bg-gray-100 cursor-not-allowed"
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="New Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <div className="col-span-2 flex gap-3 mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Save
          </button>

          <button
            onClick={handleReset}
            className="border px-6 py-2 rounded"
          >
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}