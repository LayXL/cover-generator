import { MAX_CREATED_PROJECTS } from "../../.."
import { privateProcedure } from "../../../trpc"
import { checkIsUserPremium } from "../lib/checkIsUserPremium"

export const premium = privateProcedure.query(async ({ ctx }) => {
  const isPremium = await checkIsUserPremium(ctx.user.id)

  return {
    isPremium,
    maxCreatedProjects: isPremium
      ? Number.MAX_SAFE_INTEGER
      : MAX_CREATED_PROJECTS,
  }
})
