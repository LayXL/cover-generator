import path from "node:path"
import { sentryVitePlugin } from "@sentry/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import mkcert from "vite-plugin-mkcert"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  build: { sourcemap: true },
  plugins: [
    react(),
    svgr({
      svgrOptions: {},
    }),
    mkcert(),
    sentryVitePlugin({
      org: "vlay",
      project: "covers",
    }),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/images": "http://localhost:3000",
      "/emojis": "http://localhost:3000",
    },
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})
