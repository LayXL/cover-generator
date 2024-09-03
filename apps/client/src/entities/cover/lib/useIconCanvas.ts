import { useQuery } from "@tanstack/react-query"
import { hexToRgb } from "../../../shared/utils/hexToRgb"
import { loadImage } from "../../../shared/utils/loadImage"

export const useIconCanvas = (
  iconName?: string,
  iconSize = 32,
  color?: string
) => {
  return useQuery({
    queryKey: ["iconCanvas", iconName, color, iconSize],
    queryFn: async () => {
      if (!iconName) return null

      const img = await loadImage(`/icons/${iconName}.svg`)

      const canvas = document.createElement("canvas")
      canvas.width = iconSize
      canvas.height = iconSize

      const ctx = canvas.getContext("2d")

      if (!ctx) return

      ctx.drawImage(img, 0, 0, iconSize, iconSize)

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
    },
  }).data
}
