import { hexToRgb } from "@/shared/utils/hexToRgb"
import { loadImage } from "@/shared/utils/loadImage"
import type { DeepPartial, coverIconSchema } from "shared/types"
import type { z } from "zod"

export const buildIcon = async (
  icon: DeepPartial<z.infer<typeof coverIconSchema>>,
  pixelRatio = 1
) => {
  const img = await loadImage(`/icons/${icon.name}.svg`)

  const size = (icon.size ?? 32) * pixelRatio

  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext("2d")

  if (!ctx) return

  ctx.drawImage(img, 0, 0, size, size)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  const targetRgb = hexToRgb(icon.color ?? "#000")

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255

    data[i] = targetRgb.r * alpha
    data[i + 1] = targetRgb.g * alpha
    data[i + 2] = targetRgb.b * alpha
  }

  ctx.putImageData(imageData, 0, 0)

  return canvas
}
