import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "./components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="ui-theme">
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </ThemeProvider>
);
