import { useWebApp } from "@vkruglikov/react-telegram-web-app"
import { isTelegram, isVK } from "../utils/platform-detect"

export const useOpenLink = () => {
  const webApp = useWebApp()

  return (url: string) => {
    if (isTelegram) {
      webApp.openTelegramLink(url)
    } else if (isVK) {
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("target", "_blank")
      link.click()
    }
  }
}
