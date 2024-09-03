export const useOpenLink = () => {
  return (url: string) => {
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("target", "_blank")
    link.click()
  }
}
