import "./App.css";
import { Suspense, lazy, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setInstitute } from "./reducers/instituteReducer";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import CreateDrive from "./pages/jobs/create/CreateDrive";
import GroupDetails from "./pages/placementgroups/GroupDetails";

// Lazy load components
import Loader from "./components/Loader";
const Lander = lazy(() => import("./pages/lander/Lander"));
const Layout = lazy(() => import("./components/Layout"));
const DriveLayout = lazy(() => import("./pages/jobs/job/Layout"));
const SettingsLayout = lazy(() => import("./pages/settings/Layout"));
const Start = lazy(() => import("./pages/start/Start"));
const Join = lazy(() => import("./pages/join/Join"));
const Onboarding = lazy(() => import("./pages/onboarding/Onboarding"));
const CandidateLayout = lazy(() => import("./pages/candidate/Layout"));
const CompanyDetails = lazy(
  () => import("./pages/companyprofiles/CompanyDetails")
);

// Dashboard and other main views
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Drives = lazy(() => import("./pages/jobs/Drives"));
const PlacementGroups = lazy(
  () => import("./pages/placementgroups/PlacementGroups")
);
const CompanyProfiles = lazy(
  () => import("./pages/companyprofiles/CompanyProfiles")
);
const Candidates = lazy(() => import("./pages/candidates/Candidates"));
const Analytics = lazy(() => import("./pages/analytics/Analytics"));
const Notifications = lazy(() => import("./pages/notifications/Notifications"));
const Billing = lazy(() => import("./pages/billing/Billing"));
const Documentation = lazy(() => import("./pages/documentation/Documentation"));
const Support = lazy(() => import("./pages/support/Support"));

// Job specific routes
const DriveDashboard = lazy(() => import("./pages/jobs/job/dashboard/Dashboard"));
const Workflow = lazy(() => import("./pages/jobs/job/workflow/Workflow"));
const Ats = lazy(() => import("./pages/jobs/job/ats/Ats"));
const JobCandidates = lazy(
  () => import("./pages/jobs/job/candidates/Candidates")
);
const Assessments = lazy(
  () => import("./pages/jobs/job/assessments/Assessments")
);
const Interviews = lazy(() => import("./pages/jobs/job/interviews/Interviews"));
const Selector = lazy(
  () => import("./pages/jobs/job/assessments/new/Selector")
);
const Assignments = lazy(
  () => import("./pages/jobs/job/assignment/Assignments")
);
const NewAssignment = lazy(() => import("./pages/jobs/job/assignment/New"));
const ViewAssignment = lazy(
  () => import("./pages/jobs/job/assignment/ViewAssignment")
);
const ViewAssessment = lazy(
  () => import("./pages/jobs/job/assessments/ViewAssessment/ViewAssessment")
);
const ViewUserAssessment = lazy(
  () => import("./pages/jobs/job/assessments/ViewAssessment/ViewUserAssessment")
);

// Candidate specific routes
const Apply = lazy(() => import("./pages/candidate/apply/Apply"));
const CandidatePosting = lazy(
  () => import("./pages/candidate/postings/Posting")
);
const CandidateAssignment = lazy(
  () => import("./pages/candidate/assignment/Assignment")
);

// Settings routes
const GeneralSettings = lazy(() => import("./pages/settings/general/General"));
const Members = lazy(() => import("./pages/settings/members/Member"));
const Roles = lazy(() => import("./pages/settings/roles/Roles"));
const Departments = lazy(
  () => import("./pages/settings/departments/Departments")
);
const AuditLogs = lazy(
  () => import("./pages/settings/security/audit-logs/Audit-Logs")
);
const OrgData = lazy(() => import("./pages/settings/security/data/Data"));

const StartOnboarding = lazy(() => import("./pages/onboarding/start/Start"));

function App() {
  const { user, isSignedIn } = useUser();
  const dispatch = useDispatch();

  // Sync user data with Redux
  useEffect(() => {
    if (isSignedIn) {
      const data = {
        _id: user?.publicMetadata?.orgId,
        role: user?.publicMetadata?.orgRole,
        permissions: user?.publicMetadata?.orgPermissions,
        name: user?.publicMetadata?.orgName,
      };
      dispatch(setInstitute(data));
    }
  }, [isSignedIn]);

  // Define routes for each section
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<Loader />}>
          <Lander />
        </Suspense>
      ),
    },
    {
      path: "/start",
      element: (
        <Suspense fallback={<Loader />}>
          <SignedIn>
            <Start />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </Suspense>
      ),
    },
    {
      path: "/onboarding",
      element: (
        <Suspense fallback={<Loader />}>
          <SignedIn>
            <Onboarding />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </Suspense>
      ),
    },
    {
      path: "/onboarding/start",
      element: (
        <Suspense fallback={<Loader />}>
          <SignedIn>
            <StartOnboarding />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </Suspense>
      ),
    },
    {
      path: "/join",
      element: (
        <Suspense fallback={<Loader />}>
          <SignedIn>
            <Join />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </Suspense>
      ),
    },
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

        {
          path: "dashboard",
          element: (
            <Suspense fallback={<Loader />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "drives",
          element: (
            <Suspense fallback={<Loader />}>
              <Drives />
            </Suspense>
          ),
        },
        {
          path: "drives/create",
          element: (
            <Suspense fallback={<Loader />}>
              <CreateDrive />
            </Suspense>
          ),
        },
        {
          path: "placementgroups",
          element: (
            <Suspense fallback={<Loader />}>
              <PlacementGroups />
            </Suspense>
          ),
        },
        {
          path: "companyprofiles",
          element: (
            <Suspense fallback={<Loader />}>
              <CompanyProfiles />
            </Suspense>
          ),
        },
        {
          path: "company/:id",
          element: (
            <Suspense fallback={<Loader />}>
              <CompanyDetails />
            </Suspense>
          ),
        },
        {
          path: "placementgroups",
          element: (
            <Suspense fallback={<Loader />}>
              <PlacementGroups />
            </Suspense>
          ),
        },
        {
          path: "group/:id",
          element: (
            <Suspense fallback={<Loader />}>
              <GroupDetails />
            </Suspense>
          ),
        },
        {
          path: "candidates",
          element: (
            <Suspense fallback={<Loader />}>
              <Candidates />
            </Suspense>
          ),
        },
        {
          path: "analytics",
          element: (
            <Suspense fallback={<Loader />}>
              <Analytics />
            </Suspense>
          ),
        },
        {
          path: "notifications",
          element: (
            <Suspense fallback={<Loader />}>
              <Notifications />
            </Suspense>
          ),
        },
        {
          path: "billing",
          element: (
            <Suspense fallback={<Loader />}>
              <Billing />
            </Suspense>
          ),
        },
        {
          path: "documentation",
          element: (
            <Suspense fallback={<Loader />}>
              <Documentation />
            </Suspense>
          ),
        },
        {
          path: "support",
          element: (
            <Suspense fallback={<Loader />}>
              <Support />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "jobs/:id",
      element: (
        <Suspense fallback={<Loader />}>
          <DriveLayout />
        </Suspense>
      ),
      children: [
        {
          path: "dashboard",
          element: (
            <Suspense fallback={<Loader />}>
              <DriveDashboard />
            </Suspense>
          ),
        },
        {
          path: "workflow",
          element: (
            <Suspense fallback={<Loader />}>
              <Workflow />
            </Suspense>
          ),
        },
        {
          path: "ats",
          element: (
            <Suspense fallback={<Loader />}>
              <Ats />
            </Suspense>
          ),
        },
        {
          path: "candidates",
          element: (
            <Suspense fallback={<Loader />}>
              <JobCandidates />
            </Suspense>
          ),
        },
        {
          path: "assessments",
          element: (
            <Suspense fallback={<Loader />}>
              <Assessments />
            </Suspense>
          ),
        },
        {
          path: "assessments/:id/view",
          element: (
            <Suspense fallback={<Loader />}>
              <ViewAssessment />
            </Suspense>
          ),
        },
        {
          path: "assessments/:id/view/:candId",
          element: (
            <Suspense fallback={<Loader />}>
              <ViewUserAssessment />
            </Suspense>
          ),
        },
        {
          path: "assessments/new/:type",
          element: (
            <Suspense fallback={<Loader />}>
              <Selector />
            </Suspense>
          ),
        },
        {
          path: "assignments",
          element: (
            <Suspense fallback={<Loader />}>
              <Assignments />
            </Suspense>
          ),
        },
        {
          path: "assignments/:id",
          element: (
            <Suspense fallback={<Loader />}>
              <ViewAssignment />
            </Suspense>
          ),
        },
        {
          path: "assignments/new",
          element: (
            <Suspense fallback={<Loader />}>
              <NewAssignment />
            </Suspense>
          ),
        },
        {
          path: "interviews",
          element: (
            <Suspense fallback={<Loader />}>
              <Interviews />
            </Suspense>
          ),
        },
      ],
    },

    {
      path: "/",
      element: (
        <Suspense fallback={<Loader />}>
          <CandidateLayout />
        </Suspense>
      ),
      children: [
        {
          path: "postings/:id",
          element: (
            <Suspense fallback={<Loader />}>
              <CandidatePosting />
            </Suspense>
          ),
        },
        {
          path: "postings/:id/apply",
          element: (
            <Suspense fallback={<Loader />}>
              <Apply />
            </Suspense>
          ),
        },
        {
          path: "postings/:id/assignments/:assignmentId",
          element: (
            <Suspense fallback={<Loader />}>
              <CandidateAssignment />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return (
    <main className={`text-foreground bg-background`}>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
