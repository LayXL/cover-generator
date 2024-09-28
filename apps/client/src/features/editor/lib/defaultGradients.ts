import type { hexColor } from "shared/types"
import type { z } from "zod"

export type DefaultGradient = [
  z.infer<typeof hexColor>,
  z.infer<typeof hexColor>,
]

export const defaultGradients: DefaultGradient[] = [
  ["#EECDA3", "#EF629F"],
  ["#1488CC", "#2B32B2"],
  ["#1F4037", "#99F2C8"],
  ["#654EA3", "#EAAFC8"],
  ["#799F0C", "#ACBB78"],
  ["#7F00FF", "#E100FF"],
  ["#A8FF78", "#78FFD6"],
  ["#ACB6E5", "#86FDE8"],
  ["#BC4E9C", "#F80759"],
  ["#CAC531", "#F3F9A7"],
  ["#CC2B5E", "#753A88"],
  ["#D9A7C7", "#FFFCDC"],
  ["#ED213A", "#93291E"],
  ["#EE9CA7", "#FFDDE1"],
  ["#EF3B36", "#FFFFFF"],
  ["#F12711", "#F5AF19"],
  ["#FC466B", "#3F5EFB"],
  ["#FF416C", "#FF4B2B"],
  ["#FF9966", "#FF5E62"],
  ["#FFE000", "#799F0C"],
  ["#FFE259", "#FFA751"],
]
