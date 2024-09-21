import type { DeepPartial, coverBackgroundSchema } from "shared/types"
import type { z } from "zod"
import { fillGradientBackground } from "./fillGradientBackground"
import { fillImageBackground } from "./fillImageBackground"
import { fillSolidBackground } from "./fillSolidBackground"

export const fillBackground = async (
  canvas: HTMLCanvasElement,
  background: DeepPartial<z.infer<typeof coverBackgroundSchema>>
) => {
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  switch (background.type) {
    case "solid":
      fillSolidBackground(canvas, background)
      break
    case "gradient":
      fillGradientBackground(canvas, background)
      break
    case "image":
      await fillImageBackground(canvas, background)
      break
  }
}
