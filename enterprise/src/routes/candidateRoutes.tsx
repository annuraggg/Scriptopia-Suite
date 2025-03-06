import { Suspense, lazy } from "react";
import Loader from "../components/Loader";

// Lazy load components
const CandidateLayout = lazy(() => import("../pages/candidate/Layout"));
const Apply = lazy(() => import("../pages/candidate/apply/Apply"));
const CandidatePosting = lazy(
  () => import("../pages/candidate/postings/Posting")
);
const CandidateAssignment = lazy(
  () => import("../pages/candidate/assignment/Assignment")
);
const Profile = lazy(() => import("../pages/candidate/profile/Profile"));

const candidateRoutes = [
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
      {
        path: "candidates/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <Profile />
          </Suspense>
        ),
      },
    ],
  },
];

export default candidateRoutes;
