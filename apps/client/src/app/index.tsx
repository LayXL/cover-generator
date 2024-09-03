import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { RecoilRoot } from "recoil"
import initLocalization from "../features/localization/lib/initLocalization.ts"
import "./index.css"
import { QueryProvider } from "./query-provider.tsx"
import { router } from "./router.tsx"
import ThemeConfig from "./theme-config.tsx"

initLocalization()

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <ThemeConfig>
        <QueryProvider>
          <RouterProvider router={router} />
        </QueryProvider>
      </ThemeConfig>
    </RecoilRoot>
  </StrictMode>
)
