import type { DeepPartial, coverImageBackgroundSchema } from "shared/types"
import type { z } from "zod"
import { getImage } from "./getImage"

const images: Record<string, HTMLImageElement> = {}

export const fillImageBackground = async (
  canvas: HTMLCanvasElement,
  background: DeepPartial<z.infer<typeof coverImageBackgroundSchema>>
) => {
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  if (!background.uuid) {
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    return
  }

  if (!images[background.uuid]) {
    const img = await getImage(`/images/${background.uuid}`)

    images[background.uuid] = img
  }

  drawImage(images[background.uuid], canvas, background.style ?? "cover")
}

function drawImage(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  style: "stretch" | "cover"
) {
  if (style === "stretch") {
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height)
    return
  }

  const hRatio = canvas.width / img.width
  const vRatio = canvas.height / img.height
  const ratio = Math.max(hRatio, vRatio)
  const centerShift_x = (canvas.width - img.width * ratio) / 2
  const centerShift_y = (canvas.height - img.height * ratio) / 2

  canvas
    .getContext("2d")
    ?.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    )
}
