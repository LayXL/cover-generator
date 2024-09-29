import { initLocalization } from "@/features/localization/lib/initLocalization"
import bridge from "@vkontakte/vk-bridge"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./index.css"
import { QueryProvider } from "./query-provider"
import { router } from "./router"
import { ThemeConfig } from "./theme-config"

import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "https://5c53c7d7adb8a27bdf1fa8f643fbdc8b@o4506860200984576.ingest.us.sentry.io/4508036822728704",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", "covers.layxl.dev"],
  profilesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

initLocalization()

bridge.send("VKWebAppInit")

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = createRoot(document.getElementById("root")!)

root.render(
  <StrictMode>
    <QueryProvider>
      <ThemeConfig>
        <RouterProvider router={router} />
      </ThemeConfig>
    </QueryProvider>
  </StrictMode>
)
