import { db } from "drizzle"
import { desc, eq } from "drizzle-orm"
import { projects } from "drizzle/db/schema"
import type { Cover, Project } from "shared/types"
import { z } from "zod"
import { privateProcedure } from "../../../trpc"

export const getMany = privateProcedure
  .input(z.object({}).default({}))
  .query(async ({ ctx }) => {
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.authorId, ctx.user.id),
      orderBy: desc(projects.updatedAt),
    })

    return userProjects.map((project) => {
      return {
        ...project,
        data: undefined,
        preview: (project.data as Project | undefined)?.covers[0] as
          | Cover
          | undefined,
      }
    })
  })
