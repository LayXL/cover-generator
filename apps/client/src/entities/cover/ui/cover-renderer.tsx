import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useRef } from "react"
import type { Cover, DeepPartial } from "../../../shared/types"
import { hexToRgb } from "../../../shared/utils/hexToRgb"
import { loadImage } from "../../../shared/utils/loadImage"

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180)
}

type CoverRendererProps = {
  pixelRatio?: number
} & DeepPartial<Cover>

export const CoverRenderer = (props: CoverRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const pixelRatio = props.pixelRatio ?? window.devicePixelRatio

  const rem = useCallback((n: number) => n * pixelRatio, [pixelRatio])

  const iconSize = rem(props.icon?.size ?? 32)
  const fontSize = rem(props.text?.fontSize ?? 16)

  const { data: iconCanvas } = useQuery({
    queryKey: ["iconCanvas", props.icon],
    queryFn: async () => {
      if (!props.icon) return

      const img = await loadImage(`/icons/${props.icon.name}.svg`)

      const canvas = document.createElement("canvas")
      canvas.width = iconSize
      canvas.height = iconSize

      const ctx = canvas.getContext("2d")

      if (!ctx) return

      ctx.drawImage(img, 0, 0, iconSize, iconSize)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      const targetRgb = hexToRgb(props.icon.color ?? "#000")

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3] / 255

        data[i] = targetRgb.r * alpha
        data[i + 1] = targetRgb.g * alpha
        data[i + 2] = targetRgb.b * alpha
      }

      ctx.putImageData(imageData, 0, 0)

      return canvas
    },
  })

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

      const angleRad = (props.bg.angle ?? 90) * (Math.PI / 180)

      const width = canvas.width
      const height = canvas.height

      const x0 = width / 2 + (width / 2) * Math.cos(angleRad)
      const y0 = height / 2 + (height / 2) * Math.sin(angleRad)
      const x1 = width / 2 - (width / 2) * Math.cos(angleRad)
      const y1 = height / 2 - (height / 2) * Math.sin(angleRad)

      const gradient = ctx.createLinearGradient(x0, y0, x1, y1)

      props.bg.colors
        .filter((color) => color !== undefined)
        .forEach((color, index) => {
          gradient.addColorStop(index / (props.bg.colors.length - 1), color)
        })

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    if (props.text?.value && props.text.value.length > 0) {
      ctx.fillStyle = props.text.color ?? "#000"
      ctx.font = `${fontSize}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const offset = props.icon ? iconSize / 2 + rem(4) : 0

      const top = canvas.height / 2 + offset
      const left = canvas.width / 2

      ctx.fillText(props.text.value, left, top)
    }

    if (props.icon && iconCanvas) {
      const offset =
        props.text?.value && props.text.value.length > 0
          ? fontSize / 2 + rem(4)
          : 0

      const top = canvas.height / 2 - iconSize / 2 - offset
      const left = canvas.width / 2 - iconSize / 2

      ctx.drawImage(iconCanvas, left, top, iconSize, iconSize)
    }
  }, [props.bg, props.text, props.icon, iconCanvas, fontSize, iconSize, rem])

  return (
    <canvas
      width={376 * pixelRatio}
      height={256 * pixelRatio}
      ref={canvasRef}
      className="size-full object-cover"
    />
  )
}
