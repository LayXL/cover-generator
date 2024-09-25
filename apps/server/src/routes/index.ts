import { t } from "../trpc"

import { healthcheck } from "./healthcheck"
import * as project from "./project"
import * as user from "./user"

export const router = t.router({
  healthcheck,
  project,
  user,
})

export type Router = typeof router
