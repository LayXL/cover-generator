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
        title: z.string().optional(),
      })
      .default({})
  )
  .mutation(async ({ input, ctx }) => {
    const isPremium = await checkIsUserPremium(ctx.user.id)
    const projcetsCount = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.authorId, ctx.user.id))
      .then(returnFirst)
      .then((res) => res?.count ?? 0)

    if (!isPremium && projcetsCount >= MAX_CREATED_PROJECTS) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You have reached the maximum number of projects",
      })
    }

    const project = await db
      .insert(projects)
      .values({
        authorId: ctx.user.id,
        title: input?.title,
        data: {},
      })
      .returning()
      .then(returnFirst)

    return project as NonNullable<typeof project>
  })
