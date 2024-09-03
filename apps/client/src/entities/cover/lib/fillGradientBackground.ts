import type { GradientBackground } from "@/shared/types"

export const fillGradientBackground = (
  canvas: HTMLCanvasElement,
  bg: GradientBackground
) => {
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  const colors = bg.colors.filter((color) => color !== undefined)

  const angleInRadians = (bg.angle ?? 90) * (Math.PI / 180)

  const width = canvas.width
  const height = canvas.height

  const x0 = width / 2 + (width / 2) * Math.cos(angleInRadians)
  const y0 = height / 2 + (height / 2) * Math.sin(angleInRadians)
  const x1 = width / 2 - (width / 2) * Math.cos(angleInRadians)
  const y1 = height / 2 - (height / 2) * Math.sin(angleInRadians)

  const gradient = ctx.createLinearGradient(x0, y0, x1, y1)

  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color)
  })

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}
