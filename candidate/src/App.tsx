import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import ProfileLayout from "./pages/profile/ProfileLayout";
import profileRoutes from "./routes/profileRoutes";
import Settings from "./pages/settings/Settings";
import Alerts from "./pages/alerts/Alerts";
import Home from "./pages/home/Home";
import Myjobs from "./pages/myjobs/Myjobs";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/profile",
          element: <ProfileLayout />,
          children: [...profileRoutes],
        },
        {
          path: "/myjobs",
          element: <Myjobs />,
        },
        {
          path: "/alerts",
          element: <Alerts />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
