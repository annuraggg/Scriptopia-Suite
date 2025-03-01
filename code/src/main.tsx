import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./components/ErrorPage.tsx";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <HeroUIProvider>
        <QueryClientProvider client={queryClient}>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <App />
            <Toaster richColors />
          </ClerkProvider>
        </QueryClientProvider>
      </HeroUIProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
