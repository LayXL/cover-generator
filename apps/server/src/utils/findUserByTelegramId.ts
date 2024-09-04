import { db } from "drizzle"
import { eq } from "drizzle-orm"
import { users } from "drizzle/db/schema"

export const findUserByTelegramId = (telegramId: number | bigint) => {
  return db.query.users.findFirst({
    where: eq(
      users.telegramId,
      typeof telegramId === "bigint" ? telegramId : BigInt(telegramId)
    ),
  })
}
