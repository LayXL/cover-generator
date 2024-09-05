import { TRPCError } from "@trpc/server"
import { db } from "drizzle"
import { and, eq } from "drizzle-orm"
import { projects } from "drizzle/db/schema"
import { returnFirst } from "shared/returnFirst"
import { z } from "zod"
import { privateProcedure } from "../../../trpc"

export const deleteOne = privateProcedure
  .input(
    z.object({
      id: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const project = await db
      .delete(projects)
      .where(and(eq(projects.authorId, ctx.user.id), eq(projects.id, input.id)))
      .returning()
      .then(returnFirst)

    if (!project) throw new TRPCError({ code: "NOT_FOUND" })

    return project
  })
