import { useCallback, useEffect, useRef } from "react"
import type { Cover, DeepPartial } from "../../../shared/types"
import { buildCover } from "../lib/buildCover"
import { useIconCanvas } from "../lib/useIconCanvas"

type CoverRendererProps = {
  pixelRatio?: number
} & DeepPartial<Cover>

export const CoverRenderer = (props: CoverRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const pixelRatio = props.pixelRatio ?? window.devicePixelRatio

  const toRelativePx = useCallback((n: number) => n * pixelRatio, [pixelRatio])

  const iconCanvas = useIconCanvas(
    props.icon?.name,
    toRelativePx(props.icon?.size ?? 32),
    props.icon?.color
  )

  useEffect(() => {
    if (!canvasRef.current) return

    buildCover(canvasRef.current, props, {
      pixelRatio,
      iconCanvas,
    })
  }, [props, iconCanvas, pixelRatio])

  return (
    <canvas
      width={376 * pixelRatio}
      height={256 * pixelRatio}
      ref={canvasRef}
      className="size-full object-cover"
    />
  )
}
