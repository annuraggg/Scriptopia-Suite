import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error("Missing Vite Clerk publishable key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NextUIProvider>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
        publishableKey={publishableKey}
      >
        <App />
      </ClerkProvider>
    </NextUIProvider>
  </StrictMode>
);
