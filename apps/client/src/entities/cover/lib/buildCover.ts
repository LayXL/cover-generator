import type { Cover, DeepPartial } from "@/shared/types"
import { fillBackground } from "./fillBackground"

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

  const iconCanvas = options?.iconCanvas

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (cover.bg) fillBackground(canvas, cover.bg)

  if (cover.text?.value && cover.text.value.length > 0) {
    ctx.fillStyle = cover.text.color ?? "#000"
    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const offset = cover.icon ? iconSize / 2 + toRelativePx(4) : 0

    const top = canvas.height / 2 + offset
    const left = canvas.width / 2

    ctx.fillText(cover.text.value, left, top)
  }

  if (cover.icon && iconCanvas) {
    const offset =
      cover.text?.value && cover.text.value.length > 0
        ? fontSize / 2 + toRelativePx(4)
        : 0

    const top = canvas.height / 2 - iconSize / 2 - offset
    const left = canvas.width / 2 - iconSize / 2

    ctx.drawImage(iconCanvas, left, top, iconSize, iconSize)
  }
}
