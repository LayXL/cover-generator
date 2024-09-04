import { privateProcedure } from "../trpc"

export const healthcheck = privateProcedure.query(() => true)
