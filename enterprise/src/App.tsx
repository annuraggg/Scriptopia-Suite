import "./App.css";
import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Lander from "./pages/lander/Lander";

import Layout from "./components/Layout";
import JobLayout from "./pages/jobs/job/Layout";
import SettingsLayout from "./pages/settings/Layout";
import Start from "./pages/start/Start";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import Join from "./pages/join/Join";

// import Dashboard from "./pages/dashboard/Dashboard";
// import Jobs from "./pages/jobs/Jobs";
// import Candidates from "./pages/candidates/Candidates";
// import Analytics from "./pages/analytics/Analytics";
// import Calendar from "./pages/calendar/Calendar";
// import Documentation from "./pages/documentation/Documentation";
// import Billing from "./pages/billing/Billing";
// import Support from "./pages/support/Support";

const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Jobs = lazy(() => import("./pages/jobs/Jobs"));
const Candidates = lazy(() => import("./pages/candidates/Candidates"));
const Analytics = lazy(() => import("./pages/analytics/Analytics"));
const Calendar = lazy(() => import("./pages/calendar/Calendar"));
const Documentation = lazy(() => import("./pages/documentation/Documentation"));
const Billing = lazy(() => import("./pages/billing/Billing"));
const Support = lazy(() => import("./pages/support/Support"));

const JobDashboard = lazy(() => import("./pages/jobs/job/dashboard/Dashboard"));
const Workflow = lazy(() => import("./pages/jobs/job/workflow/Workflow"));
const Ats = lazy(() => import("./pages/jobs/job/ats/Ats"));
const JobCandidates = lazy(
  () => import("./pages/jobs/job/candidates/Candidates")
);
const Assessments = lazy(
  () => import("./pages/jobs/job/assessments/Assessments")
);
const Interviews = lazy(() => import("./pages/jobs/job/interviews/Interviews"));

const GeneralSettings = lazy(() => import("./pages/settings/general/General"));
const Members = lazy(() => import("./pages/settings/members/Member"));
const Roles = lazy(() => import("./pages/settings/roles/Roles"));
const Departments = lazy(
  () => import("./pages/settings/departments/Departments")
);
const Security = lazy(() => import("./pages/settings/security/Security"));
const Personalization = lazy(
  () => import("./pages/settings/personalization/Personalization")
);
const AuditLogs = lazy(
  () => import("./pages/settings/security/audit-logs/Audit-Logs")
);
const Notifications = lazy(() => import("./pages/notifications/Notifications"));

const Loader = () => <div>Loading...</div>;

function App() {
  const jobRoutes = [
    {
      path: "dashboard",
      element: <Suspense fallback={<Loader />} children={<JobDashboard />} />,
    },
    {
      path: "workflow",
      element: <Suspense fallback={<Loader />} children={<Workflow />} />,
    },
    {
      path: "ats",
      element: <Suspense fallback={<Loader />} children={<Ats />} />,
    },
    {
      path: "candidates",
      element: <Suspense fallback={<Loader />} children={<JobCandidates />} />,
    },
    {
      path: "assessments",
      element: <Suspense fallback={<Loader />} children={<Assessments />} />,
    },
    {
      path: "interviews",
      element: <Suspense fallback={<Loader />} children={<Interviews />} />,
    },
  ];

  const settingsRoute = [
    {
      path: "general",
      element: (
        <Suspense fallback={<Loader />} children={<GeneralSettings />} />
      ),
    },
    {
      path: "members",
      element: <Suspense fallback={<Loader />} children={<Members />} />,
    },
    {
      path: "roles",
      element: <Suspense fallback={<Loader />} children={<Roles />} />,
    },
    {
      path: "departments",
      element: <Suspense fallback={<Loader />} children={<Departments />} />,
    },
    {
      path: "security",
      element: <Suspense fallback={<Loader />} children={<Security />} />,
    },
    {
      path: "personalization",
      element: (
        <Suspense fallback={<Loader />} children={<Personalization />} />
      ),
    },
    {
      path: "security/audit-logs",
      element: <Suspense fallback={<Loader />} children={<AuditLogs />} />,
    },
  ];

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Lander />,
    },
    {
      path: "/start",
      element: (
        <>
          <SignedIn>
            <Start />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      ),
    },
    {
      path: "/join",
      element: (
        <>
          <SignedIn>
            <Join />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      ),
    },
    {
      path: "/:org",
      element: <Layout />,
      children: [
        {
          path: "dashboard",
          element: <Suspense fallback={<Loader />} children={<Dashboard />} />,
        },
        {
          path: "jobs",
          element: <Suspense fallback={<Loader />} children={<Jobs />} />,
        },
        {
          path: "candidates",
          element: <Suspense fallback={<Loader />} children={<Candidates />} />,
        },
        {
          path: "analytics",
          element: <Suspense fallback={<Loader />} children={<Analytics />} />,
        },
        {
          path: "calendar",
          element: <Suspense fallback={<Loader />} children={<Calendar />} />,
        },
        {
          path: "notifications",
          element: (
            <Suspense fallback={<Loader />} children={<Notifications />} />
          ),
        },
        {
          path: "billing",
          element: <Suspense fallback={<Loader />} children={<Billing />} />,
        },
        {
          path: "documentation",
          element: (
            <Suspense fallback={<Loader />} children={<Documentation />} />
          ),
        },
        {
          path: "support",
          element: <Suspense fallback={<Loader />} children={<Support />} />,
        },
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
