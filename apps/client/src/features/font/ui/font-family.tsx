import { FloatingPortal } from "@floating-ui/react"
import { useMemo } from "react"
import { useFonts } from "../lib/useFonts"

export const FontFamily = (props: { name: string }) => {
  const fonts = useFonts()

  const style = useMemo(() => {
    const fontData = fonts.data?.find((font) => font.font === props.name)

    if (!fontData) return ""

    if (fontData.install.import)
      return `@import url(${fontData?.install.import});`

    if (fontData.install.file)
      return `@font-face {font-family: ${fontData?.font}; src: url(/fonts/${fontData?.install.file});}`

    return ""
  }, [fonts.data, props.name])

  return (
    <>
      <FloatingPortal>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </FloatingPortal>
    </>
  )
}
