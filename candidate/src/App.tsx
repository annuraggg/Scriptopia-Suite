import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import ProfileLayout from "./pages/profile/ProfileLayout";
import profileRoutes from "./routes/profileRoutes";
import Home from "./pages/home/Home";
import Lander from "./pages/lander/Lander";
import Onboarding from "./pages/onboarding/Onboarding";
import Posting from "./pages/posting/Posting";
import Apply from "./pages/posting/apply/Apply";
import Resume from "./pages/resume/Resume";
import Assignment from "./pages/posting/assignment/Assignment";
import CampusLayout from "./pages/campus/Layout";
import Drives from "./pages/campus/drives/Drives";
import PlacementGroups from "./pages/campus/placementgroups/PlacementGroups";
import JoinPlacementGroup from "./pages/campus/placementgroups/join/Join";
import Drive from "./pages/campus/drives/drive/Drive";

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
        {
          path: "postings/:id/assignments/:assignmentId",
          element: <Assignment />,
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
          path: "resume",
          element: <Resume />,
        },
        {
          path: "/campus",
          element: <CampusLayout />,
          children: [
            {
              path: "drives",
              element: <Drives />,
            },
            {
              path: "drives/:id",
              element: <Drive />,
            },
            {
              path: "placement-groups",
              element: <PlacementGroups />,
            },
            {
              path: "placement-groups/join/:id",
              element: <JoinPlacementGroup />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
