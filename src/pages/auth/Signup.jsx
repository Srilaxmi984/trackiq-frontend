import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // 🔥 ADDED useEffect
import API from "../../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("REPORTER");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "MANAGER") navigate("/manager/dashboard");
      else if (role === "DEVELOPER") navigate("/developer/dashboard");
      else navigate("/reporter/dashboard");
    }
  }, []);

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", {
        name,
        email,
        password,
        role
      });

      alert("Signup successful ✅");

      // 🔥 OPTIONAL: clear fields after signup
      setName("");
      setEmail("");
      setPassword("");
      setRole("REPORTER");

      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Signup failed ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e3a8a]">

      <div className="bg-white w-96 p-8 rounded-2xl shadow-2xl">

        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" className="w-14 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-sm text-gray-500">Join TrackIQ</p>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none"
        >
          <option value="MANAGER">Manager</option>
          <option value="REPORTER">Reporter</option>
        </select>

        <button
          onClick={handleSignup}
          className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white p-2 rounded-lg font-semibold transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#1e3a8a] font-medium cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Signup;