import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RecoilRoot } from "recoil"
import initLocalization from "../features/localization/lib/initLocalization.ts"
import "./index.css"
import { ThemeConfig } from "./theme-config.tsx"

initLocalization()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <ThemeConfig></ThemeConfig>
    </RecoilRoot>
  </StrictMode>
)
