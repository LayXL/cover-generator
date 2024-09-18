import { z } from "zod"

export const hexColor = z.custom<`#${string}`>((value) =>
  /^#([0-9a-f]{3}){1,2}$/i.test(value)
)

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export const communitySchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  avatar: z.string().optional(),
  coverUrl: z.string().url().optional(),
})

export const coverIconSchema = z.object({
  name: z.string(),
  category: z.string().max(32),
  size: z.number().min(1).max(128).default(32),
  color: z.string().nullable().optional(),
})

export const coverTextSchema = z.object({
  value: z.string().min(0).max(64).optional(),
  color: z.string().default("#000"),
  fontSize: z.number().min(1).max(128).default(32),
})

export const coverSolidBackgroundSchema = z.object({
  type: z.literal("solid"),
  color: hexColor,
})

export const coverGradientBackgroundSchema = z.object({
  type: z.literal("gradient"),
  colors: z.array(hexColor).default(["#fff", "#000"]),
  angle: z.number().min(0).max(360).default(0),
  radius: z.number().min(0.1).max(2).default(1),
  style: z.enum(["linear", "radial"]).default("linear"),
})

export const coverImageBackgroundSchema = z.object({
  type: z.literal("image"),
  uuid: z.string().uuid().optional(),
  style: z.enum(["cover", "stretch"]).default("cover"),
})

export const coverBackgroundSchema = z.discriminatedUnion("type", [
  coverSolidBackgroundSchema,
  coverGradientBackgroundSchema,
  coverImageBackgroundSchema,
])

export const coverSchema = z.object({
  uuid: z.string(),
  title: z.string().optional(),
  background: coverBackgroundSchema
    .optional()
    .default({ type: "solid", color: "#fff" }),
  icon: coverIconSchema.optional().nullable(),
  text: coverTextSchema.optional(),
})

export const projectSchema = z.object({
  title: z.string().optional(),
  community: communitySchema.optional(),
  covers: z.array(coverSchema).default([]),
})

export type Project = z.infer<typeof projectSchema>
export type Cover = z.infer<typeof coverSchema>
