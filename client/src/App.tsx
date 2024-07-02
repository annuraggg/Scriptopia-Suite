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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <Home />,
      },
      {
        path: "/about",
        element: <>ABout</>,
      },
      {
        path: "/assessments",
        element: <AssessmentDashboard />,
      },
      {
        path: "/assessments/standard/new",
        element: <New />,
      },
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
    ],
    errorElement: <ErrorPage statusCode={418} message="Render Error" />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
