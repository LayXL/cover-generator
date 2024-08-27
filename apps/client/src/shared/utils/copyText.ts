export const copyText = async (text: string) => {
  try {
    navigator.clipboard.writeText(text)
  } catch {
    // Alternative copy
    const el = document.createElement("textarea")

    el.value = text
    el.setAttribute("readonly", "")
    el.style.position = "absolute"
    el.style.left = "-9999px"
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
  }
}
