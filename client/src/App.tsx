import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import Home from "./pages/home/Home";
import AssessmentDashboard from "./pages/assessments/dashboard/Assessments";
import Problems from "./pages/problems/dashboard/Problems";
import Problem from "./pages/problems/problem/Problem";
import NewProblem from "./pages/problems/new/NewProblem";

import Layout from "./components/Layout";
// import ErrorPage from "./components/ErrorPage";
import OrgIntro from "./pages/organization/intro/Intro";
import OrgMain from "./pages/organization/main/Main";

import NewMCQ from "./pages/assessments/new/mcq/New";
import NewCode from "./pages/assessments/new/code/New";
import NewMCQCode from "./pages/assessments/new/mcqcode/New";

import MainAssessment from "./pages/assessments/assess/Main";
import AssessmentCurrent from "./pages/assessments/assess/Dashboard";
import AssessmentCurrentProblem from "./pages/assessments/assess/problem/Problem";
import Result from "./pages/assessments/assess/result/Result";
import ViewAssessment from "./pages/assessments/dashboard/ViewAssessment/ViewAssessment";
import ViewUserAssessment from "./pages/assessments/dashboard/ViewAssessment/ViewUserAssessment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,

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
        path: "/assessments/id/view",
        element: <ViewAssessment />,
      },
      {
        path: "/assessments/id/view/id",
        element: <ViewUserAssessment />,
      },
      {
        path: "/assessments/new/mcq",
        element: <NewMCQ />,
      },
      {
        path: "/assessments/new/code",
        element: <NewCode />,
      },
      {
        path: "/assessments/new/mcqcode",
        element: <NewMCQCode />,
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
    path: "/assessments/:id",
    element: <MainAssessment />,
  },
  {
    path: "/assessments/:id/current",
    element: <AssessmentCurrent />,
  },
  {
    path: "/assessments/:id/current/:probid",
    element: <AssessmentCurrentProblem />,
  },
  {
    path: "/assessments/result",
    element: <Result />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
