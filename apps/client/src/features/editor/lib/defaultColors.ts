import type { hexColor } from "shared/types"
import type { z } from "zod"

export const defaultColors: z.infer<typeof hexColor>[] = [
  "#FBFDFF",
  "#050B1E",
  "#5FA0F2",
  "#7CC05C",
  "#FC7C28",
  "#EB4758",
]
