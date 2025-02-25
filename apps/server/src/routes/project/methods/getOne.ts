import { TRPCError } from "@trpc/server"
import { db } from "drizzle"
import { and, eq } from "drizzle-orm"
import { projects } from "drizzle/db/schema"
import type { Project } from "shared/types"
import { z } from "zod"
import { privateProcedure } from "../../../trpc"

export const getOne = privateProcedure
  .input(
    z.object({
      id: z.number(),
    })
  )
  .query(async ({ ctx, input }) => {
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.authorId, ctx.user.id), eq(projects.id, input.id)),
    })

    if (!project) throw new TRPCError({ code: "NOT_FOUND" })

    return project as typeof project & { data: Project }
  })
