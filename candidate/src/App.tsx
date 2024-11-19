import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import ProfileLayout from "./pages/profile/ProfileLayout";
import profileRoutes from "./routes/profileRoutes";
import Lander from "./pages/lander/Lander";
import Onboarding from "./pages/onboarding/Onboarding";
import Resume from "./pages/resume/Resume";
import Home from "./pages/home/Home";
import Posting from "./pages/posting/Posting";

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
      ],
    },
    {
      path: "dashboard",
      element: <Layout />,
      children: [
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
          path: "home",
          element: <Home />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
