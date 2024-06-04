import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar";
import AssessmentDashboard from "./pages/assessments/dashboard/Assessments";

const router = createBrowserRouter([
  {
    path: "/",
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
  {
    path: "/assessments/dashboard",
    element: <AssessmentDashboard />,
  },
]);

const exclude = ["/sign-in", "/sign-up"];

function App() {
  return (
    <div className="overflow-auto">
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
