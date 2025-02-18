import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import ProfileLayout from "./pages/profile/ProfileLayout";
import profileRoutes from "./routes/profileRoutes";
import Home from "./pages/home/Home";
import Lander from "./pages/lander/Lander";
import Onboarding from "./pages/onboarding/Onboarding";
import Posting from "./pages/posting/Posting";
// import jobRoutes from "./routes/jobroutes";
// import JobsLayout from "./pages/jobs/JobsLayout";
import Apply from "./pages/posting/apply/Apply";
import Resume from "./pages/resume/Resume";
import Myjobs from "./pages/jobs/Myjobs";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Lander />,
    },
    {
      path: "/onboarding",
      element: <Onboarding />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "postings/:id",
          element: <Posting />,
        },
        {
          path: "postings/:id/apply",
          element: <Apply />,
        },
      ],
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "dashboard",
          element: <Home />,
        },
        {
          path: "profile",
          element: <ProfileLayout />,
          children: [...profileRoutes],
        },
        {
          path: "jobs",
          element: <Myjobs />,
          // children: [...jobRoutes],
        },
        {
          path: "resume",
          element: <Resume />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
