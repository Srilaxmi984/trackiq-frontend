import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // 🔥 ADDED useEffect

import API from "../../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 AUTO LOGIN (SESSION PERSIST)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "MANAGER") navigate("/manager/dashboard");
      else if (role === "DEVELOPER") navigate("/developer/dashboard");
      else navigate("/reporter/dashboard");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      const { token, id, name, role } = res.data;

      // ✅ STORE EVERYTHING (NO CHANGE)
      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);
      localStorage.setItem("name", name);
      localStorage.setItem("role", role);

      // 🔥 ADD THIS (SESSION FLAG)
      localStorage.setItem("isLoggedIn", "true");

      // ✅ ROLE BASED NAVIGATION (NO CHANGE)
      if (role === "MANAGER") navigate("/manager/dashboard");
      else if (role === "DEVELOPER") navigate("/developer/dashboard");
      else navigate("/reporter/dashboard");

    } catch (err) {
      console.error(err);
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e3a8a]">

      <div className="bg-white w-96 p-8 rounded-2xl shadow-2xl">

        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" className="w-14 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">TrackIQ</h2>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white p-2 rounded-lg font-semibold transition"
        >
          Login
        </button>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-700 cursor-pointer font-medium"
          >
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;