import type { Cover, DeepPartial } from "shared/types"
import { buildCover } from "./buildCover"

export const convertCoverToImage = async (
  cover: DeepPartial<Cover> | Cover
) => {
  const canvas = document.createElement("canvas")

  canvas.width = 376
  canvas.height = 256

  await buildCover(canvas, cover)

  return canvas.toDataURL("image/png")
}
