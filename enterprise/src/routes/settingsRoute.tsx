import { Suspense, lazy } from "react";
import Loader from "../components/Loader";

// Lazy load components
const Layout = lazy(() => import("../components/Layout"));
const SettingsLayout = lazy(() => import("../pages/settings/Layout"));
const GeneralSettings = lazy(() => import("../pages/settings/general/General"));
const Members = lazy(() => import("../pages/settings/members/Member"));
const Roles = lazy(() => import("../pages/settings/roles/Roles"));
const Departments = lazy(() => import("../pages/settings/departments/Departments"));
const AuditLogs = lazy(() => import("../pages/settings/security/audit-logs/Audit-Logs"));
const OrgData = lazy(() => import("../pages/settings/security/data/Data"));

const settingsRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: "/settings",
        element: (
          <Suspense fallback={<Loader />}>
            <SettingsLayout />
          </Suspense>
        ),
        children: [
          {
            path: "general",
            element: (
              <Suspense fallback={<Loader />}>
                <GeneralSettings />
              </Suspense>
            ),
          },
          {
            path: "members",
            element: (
              <Suspense fallback={<Loader />}>
                <Members />
              </Suspense>
            ),
          },
          {
            path: "roles",
            element: (
              <Suspense fallback={<Loader />}>
                <Roles />
              </Suspense>
            ),
          },
          {
            path: "departments",
            element: (
              <Suspense fallback={<Loader />}>
                <Departments />
              </Suspense>
            ),
          },
          {
            path: "security/audit-logs",
            element: (
              <Suspense fallback={<Loader />}>
                <AuditLogs />
              </Suspense>
            ),
          },
          {
            path: "security/data",
            element: (
              <Suspense fallback={<Loader />}>
                <OrgData />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];

export default settingsRoutes;