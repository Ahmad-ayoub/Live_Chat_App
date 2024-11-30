import { defineConfig } from "vite";
import commonjs from "vite-plugin-commonjs";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), commonjs()],
  build: {
    sourcemap: true,
    assets: [
      {
        src: "node_modules/bootstrap/dist/css/bootstrap.min.css",
        dest: "public/assets/css",
      },
    ],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log(
              "Sending Request to the Target:",
              proxyReq.statusCode,
              req.method,
              req.url
            );
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
});
