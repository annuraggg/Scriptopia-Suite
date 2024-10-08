import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Terms from "./pages/terms/Terms";
import Privacy from "./pages/privacy/Privacy";
import Lander from "./pages/lander/Lander";
import { useTheme } from "./components/theme-provider";
import Navbar from "./pages/lander/Navbar";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Lander />,
    },
    {
      path: "/privacy-notice",
      element: <Privacy />,
    },
    {
      path: "/terms-of-service",
      element: <Terms />,
    },
  ]);

  const { theme } = useTheme();

  return (
    <main className={`${theme === "dark" ? "dark" : ""} text-foreground bg-background`}>
      <Navbar />
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
