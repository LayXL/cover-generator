import type { hexColor } from "shared/types"
import type { z } from "zod"

export type DefaultGradient = [
  z.infer<typeof hexColor>,
  z.infer<typeof hexColor>,
]

export const defaultGradients: DefaultGradient[] = [
  ["#EECDA3", "#EF629F"],
  ["#FF9712", "#FF006E"],
  ["#B9A3EE", "#FF82B8"],
  ["#A3C6EE", "#2C07FF"],
  ["#6DFF3D", "#017C6F"],
  ["#FF070B", "#810038"],
]
