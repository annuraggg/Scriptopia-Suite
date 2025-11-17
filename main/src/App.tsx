import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Terms from "./pages/terms/Terms";
import Privacy from "./pages/privacy/Privacy";
import Lander from "./pages/lander/Lander";
import Navbar from "./pages/lander/Navbar";
import Portfolio from "./pages/portfolio/Portfolio";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Lander />,
    },
    {
      path: "/portfolio",
      element: <Portfolio />,
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

  return (
    <main>
      <Navbar />
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
