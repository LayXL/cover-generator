import { t } from "../trpc"

export const healthcheck = t.procedure.query(() => true)
