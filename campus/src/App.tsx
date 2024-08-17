import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OrganizationLayout from "./components/layout/OrganizationLayout";
import { Suspense, lazy } from "react";
import { Spinner } from "@nextui-org/react";

import SettingsLayout from "./pages/settings/Layout";

const GeneralSettings = lazy(() => import("./pages/settings/general/General"));
const Members = lazy(() => import("./pages/settings/members/Member"));
const Roles = lazy(() => import("./pages/settings/roles/Roles"));
const Security = lazy(() => import("./pages/settings/security/Security"));
const AuditLogs = lazy(
  () => import("./pages/settings/security/audit-logs/Audit-Logs")
);
const OrgData = lazy(() => import("./pages/settings/security/data/Data"));

const Loader = () => (
  <div className="spinner-container">
    <Spinner label="Loading..." color="default" />
  </div>
);

const settingsRoute = [
  {
    path: "general",
    element: <Suspense fallback={<Loader />} children={<GeneralSettings />} />,
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
    path: "security",
    element: <Suspense fallback={<Loader />} children={<Security />} />,
  },
  {
    path: "security/audit-logs",
    element: <Suspense fallback={<Loader />} children={<AuditLogs />} />,
  },
  {
    path: "security/data",
    element: <Suspense fallback={<Loader />} children={<OrgData />} />,
  },
];

function App() {
  const routes = createBrowserRouter([
    {
      path: "/organization",
      element: <OrganizationLayout />,
      children: [{ path: "", element: <></> }],
    },
    {
      path: "/student-portal",
      element: <></>,
    },
    {
      path: "/settings",
      element: <SettingsLayout />,
      children: settingsRoute,
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
