import type { Cover } from "@/shared/types"
import { convertCoverToImage } from "./convertCoverToImage"

export const downloadCover = async (cover: Cover) => {
  const link = document.createElement("a")

  link.href = await convertCoverToImage(cover)
  link.download = `${cover.uuid}.png`
  link.click()
}
