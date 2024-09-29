import path from "node:path"
import { sentryVitePlugin } from "@sentry/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import mkcert from "vite-plugin-mkcert"
import svgr from "vite-plugin-svgr"

const serverAddress = `http://localhost:${process.env.SERVER_PORT}`

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
      "/api": serverAddress,
      "/images": serverAddress,
      "/emojis": serverAddress,
    },
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})
