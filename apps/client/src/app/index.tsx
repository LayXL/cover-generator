import { initLocalization } from "@/features/localization/lib/initLocalization"
import bridge from "@vkontakte/vk-bridge"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { RecoilRoot } from "recoil"
import "./index.css"
import { QueryProvider } from "./query-provider"
import { router } from "./router"
import { ThemeConfig } from "./theme-config"

initLocalization()

bridge.send("VKWebAppInit")

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = createRoot(document.getElementById("root")!)

root.render(
  <StrictMode>
    <QueryProvider>
      <RecoilRoot>
        <ThemeConfig>
          <RouterProvider router={router} />
        </ThemeConfig>
      </RecoilRoot>
    </QueryProvider>
  </StrictMode>
)
