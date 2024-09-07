import type { DeepPartial, coverSolidBackgroundSchema } from "shared/types"
import type { z } from "zod"

export const fillSolidBackground = (
  canvas: HTMLCanvasElement,
  background: DeepPartial<z.infer<typeof coverSolidBackgroundSchema>>
) => {
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  ctx.fillStyle = background.color ?? "#fff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}
