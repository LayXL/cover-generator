import { rgbToHsl } from "@/shared/utils/rgbToHsl"
import { useEffect, useRef } from "react"

const drawSwatch = (ctx: CanvasRenderingContext2D, hue: number) => {
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  const saturationGradient = ctx.createLinearGradient(0, 0, width, 0)
  saturationGradient.addColorStop(0, "white")
  saturationGradient.addColorStop(1, `hsl(${hue}, 100%, 50%)`)

  const lightnessGradient = ctx.createLinearGradient(0, 0, 0, height)
  lightnessGradient.addColorStop(0, "rgba(0, 0, 0, 0)")
  lightnessGradient.addColorStop(1, "rgba(0, 0, 0, 1)")

  ctx.fillStyle = saturationGradient
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = lightnessGradient
  ctx.fillRect(0, 0, width, height)
}

const getColorFromCanvas = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number
) => {
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas context is not defined")

  const imageData = ctx.getImageData(x, y, 1, 1).data

  return rgbToHsl({
    r: imageData[0],
    g: imageData[1],
    b: imageData[2],
  })
}

type SwatchProps = {
  color: { h: number; s: number; l: number }
  onUpdate: (saturation: number, lightness: number) => void
}

export const Swatch = (props: SwatchProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    drawSwatch(ctx, props.color.h)
  }, [props.color])

  return (
    <canvas
      ref={canvasRef}
      width={255}
      height={255}
      onMouseMove={(event) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()

        const x = (event.clientX - rect.left) * (canvas.width / rect.width)
        const y = (event.clientY - rect.top) * (canvas.height / rect.height)

        const { s, l } = getColorFromCanvas(canvas, x, y)
        props.onUpdate(s, l)
      }}
    />
  )
}
