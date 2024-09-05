import JSZip from "jszip"
import type { Cover, DeepPartial } from "shared/types"
import { convertCoverToImage } from "./convertCoverToImage"
import { dataURItoBlob } from "./dataURItoBlob"

export const downloadCovers = async (
  covers: DeepPartial<Cover>[] | Cover[],
  name = "Covers"
) => {
  const zip = new JSZip()

  for (const cover of covers) {
    zip.file(
      `${cover.uuid}.png`,
      dataURItoBlob(await convertCoverToImage(cover))
    )
  }

  const blob = await zip.generateAsync({ type: "blob" })

  const link = document.createElement("a")

  link.href = URL.createObjectURL(blob)
  link.download = `${name}.zip`
  link.click()
}
