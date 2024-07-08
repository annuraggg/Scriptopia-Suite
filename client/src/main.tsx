import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./components/ErrorPage.tsx";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://ee70fa62b6eef4168846857ac0b90395@o4507565080444928.ingest.de.sentry.io/4507565109477456",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERdK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <ClerkProvider
          publishableKey={PUBLISHABLE_KEY}
          appearance={{
            baseTheme: dark,
          }}
        >
          <App />
        </ClerkProvider>
      </NextUIProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);
