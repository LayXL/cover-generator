import { FloatingPortal } from "@floating-ui/react"
import FontFaceObserver from "fontfaceobserver"
import { useEffect, useMemo } from "react"
import { useFonts } from "../lib/useFonts"

type FontFamilyProps = {
  name: string
  onLoaded?: () => void
}

export const FontFamily = (props: FontFamilyProps) => {
  const fonts = useFonts()
  const fontData = fonts.data?.find((font) => font.font === props.name)

  const style = useMemo(() => {
    if (!fontData) return

    if (fontData.install.import)
      return `@import url(${fontData?.install.import});`

    if (fontData.install.file)
      return `@font-face {font-family: ${fontData?.font}; src: url(/fonts/${fontData?.install.file});}`
  }, [fontData])

  useEffect(() => {
    const font = [...document.fonts].find((font) => font.family === props.name)

    if (font?.status === "loaded" || font?.status === "unloaded") {
      props.onLoaded?.()
    } else if (fontData) {
      const observer = new FontFaceObserver(fontData.font)

      observer.load().then(() => {
        props.onLoaded?.()
      })
    }
  }, [props.onLoaded, props.name, fontData])

  if (!style) return null

  return (
    <FloatingPortal>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
      <style dangerouslySetInnerHTML={{ __html: style }} />
    </FloatingPortal>
  )
}
