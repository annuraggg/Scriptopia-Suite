import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MeetV3 from "./pages/v3/Main";

function App() {
  const router = createBrowserRouter([
    {
      path: "/v3/:id",
      element: <MeetV3 />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
