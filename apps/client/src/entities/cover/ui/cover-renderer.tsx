import { useFonts } from "@/features/font/lib/useFonts"
import { cn } from "@/shared/utils/cn"
import type { ClassValue } from "clsx"
import { useEffect, useRef, useState } from "react"
import type { Cover, DeepPartial } from "shared/types"
import { buildCover } from "../lib/buildCover"

type CoverRendererProps = {
  pixelRatio?: number
  className?: ClassValue
  overrideClassName?: boolean
  id?: string
} & DeepPartial<Cover>

export const CoverRenderer = (props: CoverRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fonts = useFonts()
  const [loadedFonts, setLoadedFonts] = useState<string[]>([])

  const pixelRatio = props.pixelRatio ?? window.devicePixelRatio

  useEffect(() => {
    if (!canvasRef.current) return

    buildCover(canvasRef.current, props, { pixelRatio })
  }, [props, pixelRatio])

  useEffect(() => {
    if (
      props.text?.fontFamily &&
      !loadedFonts.includes(props.text?.fontFamily)
    ) {
      const fontData = fonts.data?.find(
        (font) => font.font === props.text?.fontFamily
      )

      if (fontData) {
        const font = new FontFace(
          props.text.fontFamily,
          `url(/fonts/${fontData.install.file})`
        )

        font.load().then((font) => {
          document.fonts.add(font)

          if (props.text?.fontFamily)
            setLoadedFonts([...loadedFonts, props.text?.fontFamily])

          document.fonts.ready.then(() => {
            if (canvasRef.current) {
              buildCover(canvasRef.current, props, { pixelRatio })
            }
          })
        })
      }
    }
  }, [fonts.data, props, pixelRatio, loadedFonts])

  return (
    <>
      <canvas
        width={376 * pixelRatio}
        height={256 * pixelRatio}
        ref={canvasRef}
        className={cn(
          !props.overrideClassName && "size-full object-cover",
          props.className
        )}
        id={props.id}
      />
    </>
  )
}
