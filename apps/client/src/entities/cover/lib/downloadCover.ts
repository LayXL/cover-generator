import type { Cover } from "@/shared/types"
import { buildCover } from "./buildCover"
import { buildIcon } from "./buildIcon"

export const downloadCover = async (cover: Cover) => {
  const canvas = document.createElement("canvas")

  canvas.width = 376
  canvas.height = 256

  buildCover(canvas, cover, {
    iconCanvas: cover.icon ? await buildIcon(cover.icon) : null,
  })

  const link = document.createElement("a")

  link.href = canvas.toDataURL("image/png")
  link.download = `${cover.uuid}.png`
  link.click()
}
