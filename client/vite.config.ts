import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      sourcemap: true,
      rollupOptions: {
        onLog(level, log, handler) {
          if (
            log.cause && // @ts-expect-error - `cause` is not in the type definition
            log.cause.message === `Can't resolve original location of error.`
          ) {
            return;
          }
          handler(level, log);
        },
      },
    },
  };
});
