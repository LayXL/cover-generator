import { db } from "drizzle"
import { eq } from "drizzle-orm"
import { userPurchases } from "drizzle/db/schema"

export const checkIsUserPremium = async (userId: number) => {
  const purchases = await db.query.userPurchases.findMany({
    where: eq(userPurchases.userId, userId),
  })

  const isPremium = purchases.length > 0

  return isPremium
}
