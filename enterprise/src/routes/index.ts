import { createBrowserRouter } from "react-router-dom";
import publicRoutes from "./publicRoutes";
import authRoutes from "./authRoutes";
import dashboardRoutes from "./dashboardRoutes";
import jobRoutes from "./jobRoutes";
import candidateRoutes from "./candidateRoutes"
import settingsRoutes from "./settingsRoute";

// Combine all routes
const router = createBrowserRouter([
  ...publicRoutes,
  ...authRoutes,
  ...dashboardRoutes,
  ...jobRoutes,
  ...candidateRoutes,
  ...settingsRoutes,
]);

export default router;
