import { z } from "zod"

export const hexColor = z.string().regex(/^#([0-9a-f]{3}){1,2}$/i)
