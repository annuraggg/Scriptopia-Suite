import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <>ABout</>,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
]);

const exclude = ["/sign-in", "/sign-up"];

function App() {
  return (
    <div className=" overflow-auto">
      <Navbar exclude={exclude} />
      <div className="h-[92vh] px-10 py-5">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
