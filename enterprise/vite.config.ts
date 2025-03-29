import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { loadEnv } from "vite";
import { compression } from "vite-plugin-compression2";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    server: {
      port: parseInt(env.VITE_PORT),
    },
    plugins: [react(), compression({ algorithm: "brotliCompress" })],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@shared-types": path.resolve(__dirname, "../common/types"),
        "@types": path.resolve(__dirname, "src/types"),
        "@shared-data": path.resolve(__dirname, "../common/data"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  };
});
