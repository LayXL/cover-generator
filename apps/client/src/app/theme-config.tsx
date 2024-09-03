import { type ReactNode, useEffect } from "react"
import {
  isAndroid,
  isDesktop,
  isIOS,
  isMacOs,
  isMobile,
  isWindows,
} from "react-device-detect"

function toggle(condition: boolean, className: string) {
  document.body.classList[condition ? "add" : "remove"](className)
}

export const ThemeConfig = ({ children }: { children?: ReactNode }) => {
  useEffect(() => {
    toggle(isMobile, "mobile")
    toggle(isDesktop, "desktop")
    toggle(isMacOs, "macos")
    toggle(isWindows, "windows")
    toggle(isIOS, "ios")
    toggle(isAndroid, "android")

    toggle(true, "dark")
  }, [])

  return children
}
