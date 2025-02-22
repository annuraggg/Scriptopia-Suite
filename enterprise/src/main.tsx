import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HeroUIProvider } from "@heroui/system";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store from "@/store/store.ts";
import { Toaster as ShadToaster } from "@/components/ui/toaster";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error("Missing Vite Clerk publishable key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HeroUIProvider>
    <Provider store={store}>
      <ClerkProvider publishableKey={publishableKey}>
        <Toaster richColors />
        <ShadToaster />
        <App />
      </ClerkProvider>
    </Provider>
  </HeroUIProvider>
);
