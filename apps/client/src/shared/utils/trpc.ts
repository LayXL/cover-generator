import { treaty } from "@elysiajs/eden"
import { createTRPCReact } from "@trpc/react-query"
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import type { app } from "server/src"
import type { Router } from "server/src/routes"

export const trpc = createTRPCReact<Router>()
export const elysia = treaty<typeof app>(window.location.origin)

export type RouterInput = inferRouterInputs<Router>
export type RouterOutput = inferRouterOutputs<Router>
