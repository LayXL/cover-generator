import { cors } from "@elysiajs/cors"
import { treaty } from "@elysiajs/eden"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { Elysia } from "elysia"
import { createContext } from "./context"
import { emojis } from "./emojis"
import { images } from "./images"
import { router } from "./routes"
import { vkPayments } from "./vkPayments"

export const app = new Elysia()
  .use(cors())
  // TODO: workaround for https://github.com/elysiajs/eden/issues/18
  .all("/api/*", (opts) =>
    fetchRequestHandler({
      endpoint: "/api",
      router: router,
      req: opts.request,
      createContext,
      onError:
        Bun.env.TEST === "true"
          ? undefined
          : (opts) => {
              console.error("Error:", opts.error)
            },
    })
  )
  .use(vkPayments)
  .use(images)
  .use(emojis)
  .listen(Bun.env.SERVER_PORT ?? 3000)

console.info(`Server is running at ${app.server?.hostname}:${app.server?.port}`)

export const elysia = treaty<typeof app>("/")
