import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import Home from "./pages/home/Home";
import AssessmentDashboard from "./pages/assessments/dashboard/Assessments";
import Problems from "./pages/problems/dashboard/Problems";
import Problem from "./pages/problems/problem/Problem";
import NewProblem from "./pages/problems/new/NewProblem";
import New from "./pages/assessments/standard/new/New";
import Layout from "./components/Layout";
import ErrorPage from "./components/ErrorPage";
import OrgIntro from "./pages/organization/intro/Intro";
import OrgMain from "./pages/organization/main/Main";
import TakeAssessment from "./pages/assessments/standard/assess/Lander";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <Home />,
      },

      // Assessments
      {
        path: "/assessments",
        element: <AssessmentDashboard />,
      },
      {
        path: "/assessments/standard/new",
        element: <New />,
      },

      // Problems
      {
        path: "/problems",
        element: <Problems />,
      },
      {
        path: "/problems/new",
        element: <NewProblem />,
      },
      {
        path: "/problems/:id",
        element: <Problem />,
      },

      {
        path: "/organization/intro",
        element: <OrgIntro />,
      },
      { path: "/organization", element: <OrgMain /> },
    ],
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/assessments/standard/:id",
    element: <TakeAssessment />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
