import { Suspense, lazy } from "react";
import Loader from "../components/Loader";

// Lazy load components
const Layout = lazy(() => import("../components/Layout"));
const CreateJob = lazy(() => import("../pages/jobs/create/CreateJob"));
const JobLayout = lazy(() => import("../pages/jobs/job/Layout"));

// Job specific routes
const JobInfo = lazy(() => import("../pages/jobs/job/info/Info"));
const JobDashboard = lazy(
  () => import("../pages/jobs/job/dashboard/Dashboard")
);
const Workflow = lazy(() => import("../pages/jobs/job/workflow/Workflow"));
const Ats = lazy(() => import("../pages/jobs/job/ats/Ats"));
const JobCandidates = lazy(
  () => import("../pages/jobs/job/candidates/Candidates")
);
const Assessments = lazy(
  () => import("../pages/jobs/job/assessments/Assessments")
);
const Interviews = lazy(
  () => import("../pages/jobs/job/interviews/Interviews")
);
const Assignments = lazy(
  () => import("../pages/jobs/job/assignment/Assignments")
);
const NewAssignment = lazy(() => import("../pages/jobs/job/assignment/New"));
const ViewAssignment = lazy(
  () => import("../pages/jobs/job/assignment/ViewAssignment")
);

const ViewCodeAssessmentResults = lazy(
  () => import("../pages/jobs/job/assessments/view/code/CodeAssessmentResults")
);
const ViewMcqAssessmentResults = lazy(
  () => import("../pages/jobs/job/assessments/view/mcq/McqAssessmentResults")
);

const ViewUserCodeAssessment = lazy(
  () => import("../pages/jobs/job/assessments/view/code/individual/View")
);

const ViewUserMCQAssessment = lazy(
  () => import("../pages/jobs/job/assessments/view/mcq/individual/View")
);

const Pipeline = lazy(() => import("../pages/jobs/job/pipeline/Pipeline"));
const CustomLayout = lazy(() => import("../pages/jobs/job/custom/Layout"));

const Custom = lazy(() => import("../pages/jobs/job/custom/Custom"));

const jobRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: "jobs/create",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateJob />
          </Suspense>
        ),
      },
      {
        path: "jobs/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <JobLayout />
          </Suspense>
        ),
        children: [
          {
            path: "info",
            element: (
              <Suspense fallback={<Loader />}>
                <JobInfo />
              </Suspense>
            ),
          },
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<Loader />}>
                <JobDashboard />
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
            path: "pipeline",
            element: (
              <Suspense fallback={<Loader />}>
                <Pipeline />
              </Suspense>
            ),
          },
          {
            path: "custom",
            element: (
              <Suspense fallback={<Loader />}>
                <CustomLayout />
              </Suspense>
            ),

            children: [
              {
                path: ":id",
                element: (
                  <Suspense fallback={<Loader />}>
                    <Custom />
                  </Suspense>
                ),
              },
            ],
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
            path: "assessments/m/:id/view/:candId",
            element: (
              <Suspense fallback={<Loader />}>
                <ViewUserMCQAssessment />
              </Suspense>
            ),
          },
          {
            path: "assessments/c/:id/view/:candId",
            element: (
              <Suspense fallback={<Loader />}>
                <ViewUserCodeAssessment />
              </Suspense>
            ),
          },
          {
            path: "assessments/c/:id/view",
            element: (
              <Suspense fallback={<Loader />}>
                <ViewCodeAssessmentResults />
              </Suspense>
            ),
          },
          {
            path: "assessments/c/:id/view",
            element: (
              <Suspense fallback={<Loader />}>
                <ViewCodeAssessmentResults />
              </Suspense>
            ),
          },
          {
            path: "assessments/m/:id/view",
            element: (
              <Suspense fallback={<Loader />}>
                <ViewMcqAssessmentResults />
              </Suspense>
            ),
          },
          //   {
          //     path: "assessments/m/:id/view/:candId",
          //     element: (
          //       <Suspense fallback={<Loader />}>
          //         <ViewMcqAssessmentResult />
          //       </Suspense>
          //     ),
          //   },
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
    ],
  },
];

export default jobRoutes;
