import { cn } from "@/shared/utils/cn"
import type { ClassValue } from "clsx"
import { useEffect, useRef } from "react"
import type { Cover, DeepPartial } from "shared/types"
import { buildCover } from "../lib/buildCover"
import { useIconCanvas } from "../lib/useIconCanvas"

type CoverRendererProps = {
  pixelRatio?: number
  className?: ClassValue
  overrideClassName?: boolean
  id?: string
} & DeepPartial<Cover>

export const CoverRenderer = (props: CoverRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const pixelRatio = props.pixelRatio ?? window.devicePixelRatio
  const iconCanvas = useIconCanvas(props.icon, pixelRatio)

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
      className={cn(
        !props.overrideClassName && "size-full object-cover",
        props.className
      )}
      id={props.id}
    />
  )
}
