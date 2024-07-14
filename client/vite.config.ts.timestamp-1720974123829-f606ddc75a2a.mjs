// vite.config.ts
import { sentryVitePlugin } from "file:///C:/Users/22204/OneDrive/Desktop/Scriptopia-Code-2.0/client/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import { defineConfig, loadEnv } from "file:///C:/Users/22204/OneDrive/Desktop/Scriptopia-Code-2.0/client/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/22204/OneDrive/Desktop/Scriptopia-Code-2.0/client/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\22204\\OneDrive\\Desktop\\Scriptopia-Code-2.0\\client";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react(),
      sentryVitePlugin({
        org: "scriptopia",
        project: "scriptopia-frontend",
        authToken: env.VITE_SENTRY_AUTH_TOKEN
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        onLog(level, log, handler) {
          if (log.cause && // @ts-expect-error - `cause` is not in the type definition
          log.cause.message === `Can't resolve original location of error.`) {
            return;
          }
          handler(level, log);
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwyMjIwNFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFNjcmlwdG9waWEtQ29kZS0yLjBcXFxcY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwyMjIwNFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFNjcmlwdG9waWEtQ29kZS0yLjBcXFxcY2xpZW50XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8yMjIwNC9PbmVEcml2ZS9EZXNrdG9wL1NjcmlwdG9waWEtQ29kZS0yLjAvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gXCJAc2VudHJ5L3ZpdGUtcGx1Z2luXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgcmVhY3QoKSxcclxuICAgICAgc2VudHJ5Vml0ZVBsdWdpbih7XHJcbiAgICAgICAgb3JnOiBcInNjcmlwdG9waWFcIixcclxuICAgICAgICBwcm9qZWN0OiBcInNjcmlwdG9waWEtZnJvbnRlbmRcIixcclxuICAgICAgICBhdXRoVG9rZW46IGVudi5WSVRFX1NFTlRSWV9BVVRIX1RPS0VOLFxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG9uTG9nKGxldmVsLCBsb2csIGhhbmRsZXIpIHtcclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgbG9nLmNhdXNlICYmIC8vIEB0cy1leHBlY3QtZXJyb3IgLSBgY2F1c2VgIGlzIG5vdCBpbiB0aGUgdHlwZSBkZWZpbml0aW9uXHJcbiAgICAgICAgICAgIGxvZy5jYXVzZS5tZXNzYWdlID09PSBgQ2FuJ3QgcmVzb2x2ZSBvcmlnaW5hbCBsb2NhdGlvbiBvZiBlcnJvci5gXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaGFuZGxlcihsZXZlbCwgbG9nKTtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VyxTQUFTLHdCQUF3QjtBQUMvWSxTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFFdkMsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04saUJBQWlCO0FBQUEsUUFDZixLQUFLO0FBQUEsUUFDTCxTQUFTO0FBQUEsUUFDVCxXQUFXLElBQUk7QUFBQSxNQUNqQixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBRUEsT0FBTztBQUFBLE1BQ0wsV0FBVztBQUFBLE1BQ1gsZUFBZTtBQUFBLFFBQ2IsTUFBTSxPQUFPLEtBQUssU0FBUztBQUN6QixjQUNFLElBQUk7QUFBQSxVQUNKLElBQUksTUFBTSxZQUFZLDZDQUN0QjtBQUNBO0FBQUEsVUFDRjtBQUNBLGtCQUFRLE9BQU8sR0FBRztBQUFBLFFBQ3BCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
