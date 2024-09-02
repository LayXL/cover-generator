import { useEffect, useRef } from "react"
import { Cover } from "../../../shared/types"

type CoverRendererProps = {
  pixelRatio?: number
} & Partial<Cover>

export const CoverRenderer = (props: CoverRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const pixelRatio = props.pixelRatio ?? window.devicePixelRatio

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    if (props.bg?.type === "solid") {
      ctx.fillStyle = props.bg.color
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    if (props.text) {
      ctx.fillStyle = props.text.color
      ctx.font = `${props.text.fontSize * pixelRatio}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(props.text.value, canvas.width / 2, canvas.height / 2)
    }
  }, [props.bg, props.text])

  return (
    <canvas
      width={376 * pixelRatio}
      height={256 * pixelRatio}
      ref={canvasRef}
      className="size-full object-cover"
    />
  )
}
