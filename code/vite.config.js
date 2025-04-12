var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { loadEnv } from "vite";
import tsconfigPaths from "vite-plugin-tsconfig-paths";
export default defineConfig(function (_a) {
    var mode = _a.mode;
    process.env = __assign(__assign({}, process.env), loadEnv(mode, process.cwd()));
    return {
        server: {
            port: parseInt(process.env.VITE_PORT),
        },
        plugins: [react(), tsconfigPaths()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
            preserveSymlinks: true,
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: function (id) {
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
        },
    };
});
