import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryPage from "./components/ErrorBoundary";


const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error("Missing Vite Clerk publishable key");
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorBoundaryPage}>
    <HeroUIProvider>
      <ClerkProvider publishableKey={publishableKey}>
        <App />
        <Toaster richColors />
      </ClerkProvider>
    </HeroUIProvider>
  </ErrorBoundary>
);
