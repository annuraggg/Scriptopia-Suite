import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Meet from "./pages/meet/Meet";

import { TestType } from "@stypes/Test";

const abc: TestType = {
  name: "abc",
}

console.log(abc);

function App() {
  const router = createBrowserRouter([
    {
      path: "/:id/:name",
      element: <Meet />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
