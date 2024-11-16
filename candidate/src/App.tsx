import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import ProfileLayout from "./pages/profile/ProfileLayout";
import profileRoutes from "./routes/profileRoutes";
import Lander from "./pages/lander/Lander";
import Onboarding from "./pages/onboarding/Onboarding";

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
      path: "dashboard",
      element: <Layout />,
      children: [
        {
          path: "profile",
          element: <ProfileLayout />,
          children: [...profileRoutes],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
