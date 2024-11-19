import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
