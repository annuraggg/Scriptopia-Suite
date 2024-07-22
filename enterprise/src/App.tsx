import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Lander from "./pages/lander/Lander";
import Layout from "./components/Layout";
import Dashboard from "./pages/postings/dashboard/Dashboard";
import Postings from "./pages/postings/Postings";
import Settings from "./pages/settings/Settings";
import CreateJob from "./pages/postings/CreatePosting";
import Apply from "./pages/postings/Apply/Apply";
import Ats from "./pages/postings/ats/Ats";
import Workflow from "./pages/postings/workflow/Workflow";
import Interviews from "./pages/postings/interviews/Interviews";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Lander />,
    },
    {
      path: "/create-job",
      element: <CreateJob />,
    },
    {
      path: "/apply",
      element: <Apply />,
    },
    {
      path: "/postings",
      element: <Postings />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/postings/:id",
      element: <Layout />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "workflow",
          element: <Workflow />,
        },
        {
          path: "ats",
          element: <Ats />,
        },
        {
          path: "interviews",
          element: <Interviews />,
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;