import { TRPCError } from "@trpc/server"
import { db } from "drizzle"
import { and, eq } from "drizzle-orm"
import { projects } from "drizzle/db/schema"
import { returnFirst } from "shared/returnFirst"
import { projectSchema } from "shared/types"
import { z } from "zod"
import { privateProcedure } from "../../../trpc"

export const update = privateProcedure
  .input(
    z.object({
      id: z.number(),
      data: projectSchema.optional(),
      title: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const project = await db
      .update(projects)
      .set({
        title: input.title,
        data: input.data,
        updatedAt: new Date(),
      })
      .where(and(eq(projects.authorId, ctx.user.id), eq(projects.id, input.id)))
      .returning()
      .then(returnFirst)

    if (!project) throw new TRPCError({ code: "NOT_FOUND" })

    return project
  })
