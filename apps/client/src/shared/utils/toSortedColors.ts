import type { HexColor } from "shared/types"
import { hexToRgb } from "./hexToRgb"

export const toSortedColors = (colors: HexColor[]) => {
  const colorData = colors.map((hex) => {
    const { r, g, b } = hexToRgb(hex)
    const brightness = calculateBrightness(r, g, b)
    const hue = calculateHue(r, g, b)

    return { hex, brightness, hue }
  })

  colorData.sort((a, b) => {
    if (a.brightness !== b.brightness) return b.brightness - a.brightness
    return a.hue - b.hue
  })

  return colorData.map((color) => color.hex)
}

function calculateBrightness(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function calculateHue(r: number, g: number, b: number) {
  const convertedR = r / 255
  const convertedG = g / 255
  const convertedB = b / 255

  const max = Math.max(convertedR, convertedG, convertedB)
  const min = Math.min(convertedR, convertedG, convertedB)
  let hue = 0

  if (max === min) {
    hue = 0 // achromatic
  } else {
    const delta = max - min
    switch (max) {
      case convertedR:
        hue =
          ((convertedG - convertedB) / delta +
            (convertedG < convertedB ? 6 : 0)) *
          60
        break
      case convertedG:
        hue = ((convertedB - convertedR) / delta + 2) * 60
        break
      case convertedB:
        hue = ((convertedR - convertedG) / delta + 4) * 60
        break
    }
  }

  return hue
}
