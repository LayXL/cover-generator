import { TRPCError, initTRPC } from "@trpc/server"
import { db } from "drizzle"
import { eq } from "drizzle-orm"
import { superUsers, users } from "drizzle/db/schema"
import superjson from "superjson"
import type { Context } from "./context"

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter:
    Bun.env.TELEGRAM_TEST_ENV === "true"
      ? undefined
      : (opts) => {
          const { shape, error } = opts

          const message =
            error.message.includes("trpc") || error.message.includes("prisma")
              ? undefined
              : error.message

          return {
            message,
            data: {
              code: shape.data.code,
              httpStatus: shape.data.httpStatus,
            },
          }
        },
})

export const privateProcedure = t.procedure.use(async (opts) => {
  const {
    ctx: { queryData },
  } = opts

  if (!queryData?.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  let userData = await db.query.users.findFirst({
    where: eq(users.vkId, queryData.userId),
  })

  if (!userData) {
    userData = (await db
      .insert(users)
      .values({
        vkId: queryData.userId,
      })
      .returning()
      .then((data) => data[0])) as NonNullable<typeof userData>
  } else {
    await db
      .update(users)
      .set({
        latestActivityAt: new Date(),
      })
      .where(eq(users.id, userData.id))
  }

  return opts.next({
    ctx: {
      user: userData,
    },
  })
})

export const adminProcedure = privateProcedure.use(async (opts) => {
  const isAdmin = await db.query.superUsers.findFirst({
    where: eq(superUsers.userId, opts.ctx.user.id),
  })

  if (!isAdmin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return opts.next(opts)
})
