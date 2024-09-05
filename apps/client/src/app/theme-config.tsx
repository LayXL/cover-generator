import { useQuery } from "@tanstack/react-query"
import bridge, { type VKBridgeSubscribeHandler } from "@vkontakte/vk-bridge"
import { AppRoot, ConfigProvider } from "@vkontakte/vkui"
import "@vkontakte/vkui/dist/vkui.css"
import { type ReactNode, useEffect, useState } from "react"
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
  const [scheme, setScheme] = useState<"light" | "dark">("dark")

  const { data: vkConfig } = useQuery({
    queryKey: ["VKConfig"],
    queryFn: () => bridge.send("VKWebAppGetConfig"),
  })

  useEffect(() => {
    if (vkConfig) setScheme(vkConfig.appearance)
  }, [vkConfig])

  useEffect(() => {
    const listener: VKBridgeSubscribeHandler = (event) => {
      if (event.detail.type !== "VKWebAppUpdateConfig") return
      setScheme(event.detail.data.appearance)
    }

    bridge.subscribe(listener)

    return () => bridge.unsubscribe(listener)
  }, [])

  useEffect(() => {
    toggle(isMobile, "mobile")
    toggle(isDesktop, "desktop")
    toggle(isMacOs, "macos")
    toggle(isWindows, "windows")
    toggle(isIOS, "ios")
    toggle(isAndroid, "android")

    toggle(scheme === "dark", "dark")
  }, [scheme])

  return (
    <ConfigProvider appearance={scheme}>
      <AppRoot mode="embedded">{children}</AppRoot>
    </ConfigProvider>
  )
}
