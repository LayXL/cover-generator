import { ReactNode, useEffect } from "react"
import {
  isAndroid,
  isDesktop,
  isIOS,
  isMacOs,
  isMobile,
  isWindows,
} from "react-device-detect"
import { isTelegram, isVK } from "../shared/utils/platform-detect"

function toggle(condition: boolean, className: string) {
  document.body.classList[condition ? "add" : "remove"](className)
}

function componentToHex(c: number) {
  const hex = c.toString(16)
  return hex.length == 1 ? "0" + hex : hex
}

export function ThemeConfig({ children }: { children?: ReactNode }) {
  useEffect(() => {
    toggle(isMobile, "mobile")
    toggle(isDesktop, "desktop")
    toggle(isMacOs, "macos")
    toggle(isWindows, "windows")
    toggle(isIOS, "ios")
    toggle(isAndroid, "android")
    toggle(isVK, "vk")
    toggle(isTelegram, "telegram")

    toggle(true, "dark")
  }, [])

  return children
}
