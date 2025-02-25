import { unlink } from "node:fs"
import { TRPCError } from "@trpc/server"
import { db } from "drizzle"
import { and, eq, inArray } from "drizzle-orm"
import { media, projects } from "drizzle/db/schema"
import { returnFirst } from "shared/returnFirst"
import { type Project, projectSchema } from "shared/types"
import { z } from "zod"
import { privateProcedure } from "../../../trpc"
import { escapePath } from "../../../utils/escapePath"
import { checkIsUserPremium } from "../../user/lib/checkIsUserPremium"

export const update = privateProcedure
  .input(
    z.object({
      id: z.number(),
      data: projectSchema.optional(),
      title: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const isPremium = await checkIsUserPremium(ctx.user.id)
    const coversCount = input.data?.covers.length ?? 0

    if (!isPremium && coversCount > 4) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You can't add more covers",
      })
    }

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

    const mediaInProject = await db.query.media.findMany({
      where: (table) => eq(table.projectId, project.id),
    })

    if ((project.data as Project).covers.length > 0) {
      const projectData = JSON.stringify(project.data)

      const notUsedMedia = mediaInProject
        .filter((media) => !projectData.includes(media.uuid))
        .map((media) => media.uuid)

      for (const uuid of notUsedMedia) {
        unlink(`./images/${escapePath(uuid)}.webp`, () => {})
      }

      if (notUsedMedia.length > 0)
        await db.delete(media).where(inArray(media.uuid, notUsedMedia))
    }

    return project
  })
