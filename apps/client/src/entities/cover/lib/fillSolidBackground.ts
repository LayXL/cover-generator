import type { SolidBackground } from "shared/types"

export const fillSolidBackground = (
  canvas: HTMLCanvasElement,
  bg: SolidBackground
) => {
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  ctx.fillStyle = bg.color ?? "#fff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}
