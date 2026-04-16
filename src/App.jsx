import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* EXISTING */
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

/* MANAGER */
import Layout from "./components/layout/Layout";
import ManagerDashboard from "./pages/manager/Dashboard";
import Projects from "./pages/manager/Projects";
import Issues from "./pages/manager/Issues";
import Kanban from "./pages/manager/Kanban";
import Developers from "./pages/manager/Developers";
import Feedback from "./pages/manager/Feedback";
import Profile from "./pages/manager/Profile"; // ✅ FIXED IMPORT

/* REPORTER */
import ReporterLayout from "./components/layout/ReporterLayout";
import ReporterDashboard from "./pages/reporter/Dashboard";
import CreateComplaint from "./pages/reporter/CreateComplaint";
import MyComplaints from "./pages/reporter/MyComplaints";
import ReporterFeedback from "./pages/reporter/Feedback";
import ReporterProfile from "./pages/reporter/Profile";

/* DEVELOPER */
import DeveloperLayout from "./components/layout/DeveloperLayout";
import DevDashboard from "./pages/developer/Dashboard";
import MyIssues from "./pages/developer/MyIssues";
import DevKanban from "./pages/developer/Kanban";
import DevProfile from "./pages/developer/Profile";
import DeveloperFeedback from "./pages/developer/DeveloperFeedback"; // ✅ NEW PAGE    
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* MANAGER */}
        <Route path="/manager" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="issues" element={<Issues />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="developers" element={<Developers />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* REPORTER */}
        <Route path="/reporter" element={<ReporterLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<ReporterDashboard />} />
          <Route path="new" element={<CreateComplaint />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="feedback" element={<ReporterFeedback />} />
          <Route path="profile" element={<ReporterProfile />} />
        </Route>

        {/* DEVELOPER */}
        <Route path="/developer" element={<DeveloperLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<DevDashboard />} />
          <Route path="issues" element={<MyIssues />} />
          <Route path="kanban" element={<DevKanban />} />
          <Route path="feedback" element={<DeveloperFeedback />} /> 
          <Route path="profile" element={<DevProfile />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;