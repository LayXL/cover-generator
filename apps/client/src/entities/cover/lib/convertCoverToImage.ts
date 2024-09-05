import type { Cover, DeepPartial } from "shared/types"
import { buildCover } from "./buildCover"
import { buildIcon } from "./buildIcon"

export const convertCoverToImage = async (
  cover: DeepPartial<Cover> | Cover
) => {
  const canvas = document.createElement("canvas")

  canvas.width = 376
  canvas.height = 256

  buildCover(canvas, cover, {
    iconCanvas: cover.icon ? await buildIcon(cover.icon) : null,
  })

  return canvas.toDataURL("image/png")
}
