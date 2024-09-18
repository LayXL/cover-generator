import { hexToRgb } from "@/shared/utils/hexToRgb"

export const drawRecoloredImage = (
  img: HTMLImageElement,
  color?: string | null
) => {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 1024

  const ctx = canvas.getContext("2d")

  if (!ctx) throw new Error("Could not get 2d context")

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  const targetRgb = hexToRgb(color ?? "#000")

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255

    data[i] = targetRgb.r * alpha
    data[i + 1] = targetRgb.g * alpha
    data[i + 2] = targetRgb.b * alpha
  }

  ctx.putImageData(imageData, 0, 0)

  return canvas
}
