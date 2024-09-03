import { useCallback, useEffect, useRef } from "react"
import type { Cover, DeepPartial } from "../../../shared/types"
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
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (props.bg?.type === "solid") {
      ctx.fillStyle = props.bg.color ?? "#fff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else if (props.bg?.type === "gradient") {
      if (!props.bg.colors) return

      const colors = props.bg.colors.filter((color) => color !== undefined)

      const angleInRadians = (props.bg.angle ?? 90) * (Math.PI / 180)

      const width = canvas.width
      const height = canvas.height

      const x0 = width / 2 + (width / 2) * Math.cos(angleInRadians)
      const y0 = height / 2 + (height / 2) * Math.sin(angleInRadians)
      const x1 = width / 2 - (width / 2) * Math.cos(angleInRadians)
      const y1 = height / 2 - (height / 2) * Math.sin(angleInRadians)

      const gradient = ctx.createLinearGradient(x0, y0, x1, y1)

      colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color)
      })

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

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
