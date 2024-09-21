import JSZip from "jszip"
import { getI18n } from "react-i18next"
import type { Cover, DeepPartial } from "shared/types"
import { convertCoverToImage } from "./convertCoverToImage"

function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(",")
  const mime = arr[0].match(/:(.*?);/)?.[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

export const downloadCovers = async (
  covers: DeepPartial<Cover>[] | Cover[],
  name = "Covers"
) => {
  const zip = new JSZip()

  for (const cover of covers) {
    const image = await convertCoverToImage(cover)

    zip.file(
      `${cover.title ?? getI18n().t("untitled-cover-placeholder")}.png`,
      dataURLtoBlob(image)
    )
  }

  const blob = await zip.generateAsync({ type: "blob" })

  const link = document.createElement("a")

  link.href = URL.createObjectURL(blob)
  link.download = `${name}.zip`
  link.click()
}
