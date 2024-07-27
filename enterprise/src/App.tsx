import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Lander from "./pages/lander/Lander";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Jobs from "./pages/jobs/Jobs";
import Candidates from "./pages/candidates/Candidates";
import Analytics from "./pages/analytics/Analytics";
import Calendar from "./pages/calendar/Calendar";
import Documentation from "./pages/documentation/Documentation";
import Billing from "./pages/billing/Billing";
import Support from "./pages/support/Support";

import JobLayout from "./pages/jobs/job/Layout";
import JobDashboard from "./pages/jobs/job/dashboard/Dashboard";
import Workflow from "./pages/jobs/job/workflow/Workflow";
import Ats from "./pages/jobs/job/ats/Ats";
import JobCandidates from "./pages/jobs/job/candidates/Candidates";
import Assessments from "./pages/jobs/job/assessments/Assessments";
import Interviews from "./pages/jobs/job/interviews/Interviews";

import SettingsLayout from "./pages/settings/Layout";
import GeneralSettings from "./pages/settings/general/General";
import Members from "./pages/settings/members/Member";
import Roles from "./pages/settings/roles/Roles";
import Departments from "./pages/settings/departments/Departments";
import Security from "./pages/settings/security/Security";
import Personalization from "./pages/settings/personalization/Personalization";
import AuditLogs from "./pages/settings/security/audit-logs/Audit-Logs";
import Notifications from "./pages/notifications/Notifications";

// import Dashboard from "./pages/postings/dashboard/Dashboard";
// import Postings from "./pages/postings/Postings";
// import Settings from "./pages/settings/Settings";
// import CreateJob from "./pages/postings/CreatePosting";
// import Apply from "./pages/postings/Apply/Apply";
// import Ats from "./pages/postings/ats/Ats";
// import Workflow from "./pages/postings/workflow/Workflow";
// import Interviews from "./pages/postings/interviews/Interviews";

function App() {
  const jobRoutes = [
    { path: "dashboard", element: <JobDashboard /> },
    { path: "workflow", element: <Workflow /> },
    { path: "ats", element: <Ats /> },
    { path: "candidates", element: <JobCandidates /> },
    { path: "assessments", element: <Assessments /> },
    { path: "interviews", element: <Interviews /> },
  ];

  const settingsRoute = [
    { path: "general", element: <GeneralSettings /> },
    { path: "members", element: <Members /> },
    { path: "roles", element: <Roles /> },
    { path: "departments", element: <Departments /> },
    { path: "security", element: <Security /> },
    { path: "personalization", element: <Personalization /> },

    { path: "security/audit-logs", element: <AuditLogs /> },
  ];

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Lander />,
    },
    {
      path: "/:org",
      element: <Layout />,
      children: [
        { path: "dashboard", element: <Dashboard /> },

        { path: "jobs", element: <Jobs /> },

        { path: "candidates", element: <Candidates /> },
        { path: "analytics", element: <Analytics /> },
        { path: "calendar", element: <Calendar /> },

        { path: "notifications", element: <Notifications /> },
        { path: "billing", element: <Billing /> },
        { path: "documentation", element: <Documentation /> },
        { path: "support", element: <Support /> },
      ],
    },

    {
      path: ":org/jobs/:id",
      element: <JobLayout />,
      children: jobRoutes,
    },
    {
      path: ":org/settings",
      element: <SettingsLayout />,
      children: settingsRoute,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
