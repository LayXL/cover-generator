import { unlink } from "node:fs"
import { TRPCError } from "@trpc/server"
import { db } from "drizzle"
import { and, eq } from "drizzle-orm"
import { media, projects } from "drizzle/db/schema"
import { returnFirst } from "shared/returnFirst"
import { z } from "zod"
import { privateProcedure } from "../../../trpc"
import { escapePath } from "../../../utils/escapePath"

export const deleteOne = privateProcedure
  .input(
    z.object({
      id: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const mediaInProject = await db
      .select()
      .from(media)
      .where(eq(media.projectId, input.id))

    const project = await db
      .delete(projects)
      .where(and(eq(projects.authorId, ctx.user.id), eq(projects.id, input.id)))
      .returning()
      .then(returnFirst)

    if (!project) throw new TRPCError({ code: "NOT_FOUND" })

    for (const { uuid } of mediaInProject) {
      unlink(`./images/${escapePath(uuid)}.webp`, () => {})
    }

    return project
  })
