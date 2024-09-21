import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

const config = ({ mode }) => {
  return defineConfig({
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
      }),
      mkcert(),
    ],
    server: {
      https: true,
    },
    base: "",
    define: {
      "process.env.NODE_ENV": `"${mode}"`,
    },
    optimizeDeps: {
      // 👈 optimizedeps
      esbuildOptions: {
        target: "esnext",
        // Node.js global to browser globalThis
        define: {
          global: "globalThis",
        },
        supported: {
          bigint: true,
        },
      },
    },
    build: {
      target: ["esnext"], // 👈 build.target
      outDir: "build",
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            return "vendor";
          },
        },
      },
    },
  });
};

export default config;
