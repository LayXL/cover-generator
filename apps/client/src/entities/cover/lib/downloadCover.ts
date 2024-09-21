import bridge from "@vkontakte/vk-bridge"
import { getI18n } from "react-i18next"
import type { Cover } from "shared/types"
import { convertCoverToImage } from "./convertCoverToImage"

export const downloadCover = async (cover: Cover) => {
  const img = await convertCoverToImage(cover)

  await bridge
    .send("VKWebAppDownloadFile", {
      url: img,
      filename: `${cover.uuid}.png`,
    })
    .catch(() => {
      const link = document.createElement("a")

      link.href = img
      link.download = `${cover.title ?? getI18n().t("untitled-cover-placeholder")}.png`
      link.click()
    })
}
