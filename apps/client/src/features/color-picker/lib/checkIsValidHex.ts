import { z } from "zod"

export const hexColor = z.custom<`#${string}`>((value) =>
  /^#([0-9a-f]{3}){1,2}$/i.test(value)
)
