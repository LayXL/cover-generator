import type { hexColor } from "shared/types"
import type { z } from "zod"

export const defaultColors: z.infer<typeof hexColor>[] = [
  "#000000",
  "#00CC69",
  "#071AA5",
  "#25874F",
  "#34B3B3",
  "#4E1382",
  "#4F4135",
  "#6A68D6",
  "#754DA8",
  "#82E7FE",
  "#8B8C50",
  "#8BBAE9",
  "#9747FF",
  "#986842",
  "#9A0088",
  "#C00077",
  "#CB0032",
  "#E74857",
  "#E74857",
  "#FEB1DD",
  "#FF712F",
  "#FFB900",
  "#FFCA1A",
  "#FFFFFF",
]
