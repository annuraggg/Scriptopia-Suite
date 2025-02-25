import { Suspense, lazy } from "react";
import Loader from "../components/Loader";

// Lazy load components
const Lander = lazy(() => import("../pages/lander/Lander"));

const publicRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <Lander />
      </Suspense>
    ),
  },
];

export default publicRoutes;
