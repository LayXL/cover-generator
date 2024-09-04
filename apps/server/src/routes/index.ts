import { t } from "../trpc"

import * as user from "./user"

export const router = t.router({
  user,
})

export type Router = typeof router
