import { TRPCError } from "@trpc/server"
import { db } from "drizzle"
import { count, eq } from "drizzle-orm"
import { projects } from "drizzle/db/schema"
import { returnFirst } from "shared/returnFirst"
import { z } from "zod"
import { MAX_CREATED_PROJECTS } from "../../.."
import { privateProcedure } from "../../../trpc"
import { checkIsUserPremium } from "../../user/lib/checkIsUserPremium"

export const create = privateProcedure
  .input(
    z
      .object({
        title: z
          .string()
          .min(3)
          .max(100)
          .transform((title) => (title.trim().length > 0 ? title : null))
          .optional()
          .nullable(),
      })
      .default({})
  )
  .mutation(async ({ input, ctx }) => {
    const isPremium = await checkIsUserPremium(ctx.user.id)

    const project = await db.transaction(async (tx) => {
      const project = await tx
        .insert(projects)
        .values({
          authorId: ctx.user.id,
          title: input?.title,
          data: {},
        })
        .returning()
        .then(returnFirst)

      const projectsCount = await db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.authorId, ctx.user.id))
        .then(returnFirst)
        .then((res) => res?.count ?? 0)

      if (!isPremium && projectsCount > MAX_CREATED_PROJECTS) {
        tx.rollback()
        return false
      }

      return project
    })

    if (project) return project as NonNullable<typeof project>

    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
  })
