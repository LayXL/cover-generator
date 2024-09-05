import { TRPCError } from "@trpc/server"
import { db } from "drizzle"
import { and, eq } from "drizzle-orm"
import { projects } from "drizzle/db/schema"
import { z } from "zod"
import { privateProcedure } from "../../../trpc"

export const getOne = privateProcedure
  .input(
    z.object({
      id: z.number(),
    })
  )
  .mutation(async ({ ctx }) => {
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.authorId, ctx.user.id), eq(projects.id, 1)),
    })

    if (!project) throw new TRPCError({ code: "NOT_FOUND" })

    return project
  })
