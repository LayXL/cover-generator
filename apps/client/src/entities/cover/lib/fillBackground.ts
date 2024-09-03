import type {
  Background,
  DeepPartial,
  GradientBackground,
  SolidBackground,
} from "@/shared/types"
import { fillGradientBackground } from "./fillGradientBackground"
import { fillSolidBackground } from "./fillSolidBackground"

export const fillBackground = (
  canvas: HTMLCanvasElement,
  bg: DeepPartial<Background>
) => {
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  switch (bg.type) {
    case "solid":
      fillSolidBackground(canvas, bg as SolidBackground)
      break
    case "gradient":
      if (!bg.colors) return
      fillGradientBackground(canvas, bg as GradientBackground)
      break
  }
}
