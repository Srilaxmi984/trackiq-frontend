import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] flex flex-col">

      {/* 🔝 NAVBAR */}
      <div className="flex justify-between items-center px-10 py-5 text-white">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="w-10 h-10" />
          <h1 className="text-xl font-semibold tracking-wide">TrackIQ</h1>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 border border-white rounded-lg hover:bg-white hover:text-[#1e3a8a] transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 bg-white text-[#1e3a8a] rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Sign Up
          </button>
        </div>

      </div>

      {/* 🎯 HERO SECTION */}
      <div className="flex flex-1 items-center justify-center text-center text-white px-6">

        <div className="max-w-2xl">

          <h1 className="text-5xl font-bold mb-5 leading-tight">
            Smart Issue Tracking <br /> for Modern Teams 🚀
          </h1>

          <p className="text-blue-200 text-lg mb-8">
            Manage projects, assign tasks, track progress, and deliver faster —
            all in one powerful platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">

            <button
              onClick={() => navigate("/login")}
              className="px-7 py-3 bg-white text-[#1e3a8a] rounded-xl font-semibold shadow hover:bg-gray-100 transition"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-7 py-3 border border-white rounded-xl hover:bg-white hover:text-[#1e3a8a] transition"
            >
              Create Account
            </button>

          </div>

        </div>

      </div>

      {/* 🔽 FOOTER */}
      <div className="text-center text-blue-300 pb-4 text-sm">
        © 2026 TrackIQ — Smart Issue Tracking System
      </div>

    </div>
  );
};

export default Landing;