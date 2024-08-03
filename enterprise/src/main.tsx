import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import { dark } from "@clerk/themes";
import { Provider } from "react-redux";
import store from "@/store/store.ts";
import { Toaster as ShadToaster } from "@/components/ui/toaster"

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error("Missing Vite Clerk publishable key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        baseTheme: dark,
      }}
    >
      <NextUIProvider>
        <Toaster richColors theme="dark" />
        <ShadToaster />
        <App />
      </NextUIProvider>
    </ClerkProvider>
  </Provider>
);
