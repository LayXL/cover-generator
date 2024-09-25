import { db } from "drizzle"
import { projects } from "drizzle/db/schema"
import { returnFirst } from "shared/returnFirst"
import { z } from "zod"
import { privateProcedure } from "../../../trpc"

export const create = privateProcedure
  .input(
    z
      .object({
        title: z.string().optional(),
      })
      .default({})
  )
  .mutation(async ({ input, ctx }) => {
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
