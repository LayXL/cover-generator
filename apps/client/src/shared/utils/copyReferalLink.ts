import { isTelegram, isVK } from "./platform-detect"

export const copyReferalLink = async (userId: number) => {
  const url = isTelegram
    ? `t.me/fiveletters_gamebot/play?startapp=ref${userId}`
    : isVK
      ? `vk.com/app51918193#ref${userId}`
      : ""

  navigator.clipboard.writeText(url).catch(() => {
    // Alternative copy
    const el = document.createElement("textarea")

    el.value = url
    el.setAttribute("readonly", "")
    el.style.position = "absolute"
    el.style.left = "-9999px"
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
  })
}
