import { privateProcedure } from "../../../trpc"
import { checkIsUserPremium } from "../lib/checkIsUserPremium"

export const premium = privateProcedure.query(async ({ ctx }) => {
  return {
    isPremium: checkIsUserPremium(ctx.user.id),
  }
})
