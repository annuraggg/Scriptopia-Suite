import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar";
import AssessmentDashboard from "./pages/assessments/dashboard/Assessments";
import Problems from "./pages/problems/dashboard/Problems";
import Problem from "./pages/problems/problem/Problem";
import NewProblem from "./pages/problems/new/NewProblem";
import { Toaster } from "./components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Home />,
  },
  {
    path: "/about",
    element: <>ABout</>,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },

  // Assessments
  {
    path: "/assessments",
    element: <AssessmentDashboard />,
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
]);

const exclude = ["/sign-in", "/sign-up"];

function App() {
  return (
    <div className="overflow-auto">
      <Toaster />
      <Navbar exclude={exclude} />
      <div
        className={` 
      ${exclude.includes(window.location.pathname) ? "h-[100vh]" : "h-[90vh]"}
        px-10`}
      >
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
