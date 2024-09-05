import { db } from "drizzle"
import { eq } from "drizzle-orm"
import { projects } from "drizzle/db/schema"
import { z } from "zod"
import { privateProcedure } from "../../../trpc"

export const getMany = privateProcedure
  .input(z.object({}).default({}))
  .query(async ({ ctx }) => {
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.authorId, ctx.user.id),
      columns: {
        data: false,
      },
    })

    return userProjects
  })
