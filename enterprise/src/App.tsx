import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Lander from "./pages/lander/Lander";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Jobs from "./pages/jobs/Jobs";
import Candidates from "./pages/candidates/Candidates";
import Analytics from "./pages/analytics/Analytics";
import Calendar from "./pages/calendar/Calendar";
import Settings from "./pages/settings/Settings";
import Documentation from "./pages/documentation/Documentation";
import Billing from "./pages/billing/Billing";
import Support from "./pages/support/Support";

import JobLayout from "./pages/jobs/job/Layout";
import JobDashboard from "./pages/jobs/job/dashboard/Dashboard";
import Workflow from "./pages/jobs/job/workflow/Workflow";
import Ats from "./pages/jobs/job/ats/Ats";
import Assessments from "./pages/jobs/job/assessments/Assessments";
import Interviews from "./pages/jobs/job/interviews/Interviews";
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
    { path: "assessments", element: <Assessments /> },
    { path: "interviews", element: <Interviews /> },
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

        { path: "settings", element: <Settings /> },
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
  ]);

  return <RouterProvider router={router} />;
}

export default App;
