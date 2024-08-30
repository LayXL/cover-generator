import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { RecoilRoot } from "recoil"
import initLocalization from "../features/localization/lib/initLocalization.ts"
import "./index.css"
import { router } from "./router.tsx"
import { ThemeConfig } from "./theme-config.tsx"

initLocalization()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <ThemeConfig>
        <RouterProvider router={router} />
      </ThemeConfig>
    </RecoilRoot>
  </StrictMode>
)
