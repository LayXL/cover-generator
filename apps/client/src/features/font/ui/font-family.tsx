import { FloatingPortal } from "@floating-ui/react"
import { useMemo } from "react"
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

  if (!style) return null

  return (
    <FloatingPortal>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
      <style dangerouslySetInnerHTML={{ __html: style }} />
    </FloatingPortal>
  )
}
