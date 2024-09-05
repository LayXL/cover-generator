import { createTRPCReact } from "@trpc/react-query"
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import type { Router } from "server/src/routes"

// const token = window.Telegram.WebApp.initData || window.location.search.slice(1)

export const trpc = createTRPCReact<Router>()

export type RouterInput = inferRouterInputs<Router>
export type RouterOutput = inferRouterOutputs<Router>

// export const client = createTRPCClient<Router>({
//   links: [
//     httpBatchLink({
//       transformer: superjson,
//       url: "/api",
//       async headers() {
//         return {
//           authorization: `Bearer ${token}`,
//         }
//       },
//     }),
//   ],
// })
