import { useCallback, useEffect, useRef } from "react"
import type { Cover, DeepPartial } from "../../../shared/types"
import { fillBackground } from "../lib/fillBackground"
import { useIconCanvas } from "../lib/useIconCanvas"

type CoverRendererProps = {
  pixelRatio?: number
} & DeepPartial<Cover>

export const CoverRenderer = (props: CoverRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const pixelRatio = props.pixelRatio ?? window.devicePixelRatio

  const toRelativePx = useCallback((n: number) => n * pixelRatio, [pixelRatio])

  const iconSize = toRelativePx(props.icon?.size ?? 32)
  const fontSize = toRelativePx(props.text?.fontSize ?? 16)

  const iconCanvas = useIconCanvas(
    props.icon?.name,
    iconSize,
    props.icon?.color
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")

    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (props.bg) fillBackground(canvas, props.bg)

    if (props.text?.value && props.text.value.length > 0) {
      ctx.fillStyle = props.text.color ?? "#000"
      ctx.font = `${fontSize}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const offset = props.icon ? iconSize / 2 + toRelativePx(4) : 0

      const top = canvas.height / 2 + offset
      const left = canvas.width / 2

      ctx.fillText(props.text.value, left, top)
    }

    if (props.icon && iconCanvas) {
      const offset =
        props.text?.value && props.text.value.length > 0
          ? fontSize / 2 + toRelativePx(4)
          : 0

      const top = canvas.height / 2 - iconSize / 2 - offset
      const left = canvas.width / 2 - iconSize / 2

      ctx.drawImage(iconCanvas, left, top, iconSize, iconSize)
    }
  }, [
    props.bg,
    props.text,
    props.icon,
    iconCanvas,
    fontSize,
    iconSize,
    toRelativePx,
  ])

  return (
    <canvas
      width={376 * pixelRatio}
      height={256 * pixelRatio}
      ref={canvasRef}
      className="size-full object-cover"
    />
  )
}
