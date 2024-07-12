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
// import ErrorPage from "./components/ErrorPage";
import OrgIntro from "./pages/organization/intro/Intro";
import OrgMain from "./pages/organization/main/Main";
import MainAssessment from "./pages/assessments/standard/assess/MainWindow";
import AssessmentCurrent from "./pages/assessments/standard/assess/Main";
import AssessmentCurrentProblem from "./pages/assessments/standard/assess/problem/Problem";
import Result from "./pages/assessments/standard/assess/Result";

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
    element: <MainAssessment />,
  },
  {
    path: "/assessments/standard/:id/current",
    element: <AssessmentCurrent />,
  },
  {
    path: "/assessments/standard/:id/current/:probid",
    element: <AssessmentCurrentProblem />,
  },
  {
    path: "/assessments/standard/result",
    element: <Result />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
