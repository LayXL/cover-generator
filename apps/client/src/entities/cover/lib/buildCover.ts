import type { Cover, DeepPartial } from "shared/types"
import { drawRecoloredImage } from "./drawRecoloredImage"
import { fillBackground } from "./fillBackground"

const icons: Record<string, HTMLImageElement> = {}

export const buildCover = (
  canvas: HTMLCanvasElement,
  cover: DeepPartial<Cover>,
  options?: { pixelRatio?: number; iconCanvas?: HTMLCanvasElement | null }
) => {
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  const toRelativePx = (n: number) => n * (options?.pixelRatio ?? 1)

  const iconSize = toRelativePx(cover.icon?.size ?? 32)
  const fontSize = toRelativePx(cover.text?.fontSize ?? 16)

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (cover.background) fillBackground(canvas, cover.background)

  if (cover.text?.value && cover.text.value.length > 0) {
    ctx.fillStyle = cover.text.color ?? "#000"
    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const offset = cover.icon?.name ? iconSize / 2 + toRelativePx(4) : 0

    const top = canvas.height / 2 + offset
    const left = canvas.width / 2

    ctx.fillText(cover.text.value, left, top)
  }

  if (cover.icon?.name) {
    const offset =
      cover.text?.value && cover.text.value.length > 0
        ? fontSize / 2 + toRelativePx(4)
        : 0

    const top = canvas.height / 2 - iconSize / 2 - offset
    const left = canvas.width / 2 - iconSize / 2

    const iconElement = icons[cover.icon.name]

    if (!iconElement) {
      const img = new Image()
      img.src =
        cover.icon.category !== "emoji"
          ? `/icons/${cover.icon.name}.svg`
          : `/emojis/${cover.icon.name}.png`

      img.onload = () => {
        if (!cover.icon?.name) return
        icons[cover.icon.name] = img

        ctx.drawImage(
          drawRecoloredImage(img, cover.icon.color),
          left,
          top,
          iconSize,
          iconSize
        )
      }
    } else {
      ctx.drawImage(
        drawRecoloredImage(iconElement, cover.icon.color),
        left,
        top,
        iconSize,
        iconSize
      )
    }
  }
}
