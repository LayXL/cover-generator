import { cors } from "@elysiajs/cors"
import { treaty } from "@elysiajs/eden"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { Elysia } from "elysia"
import { createContext } from "./context"
import { images } from "./images"
import { router } from "./routes"
import { vkPayments } from "./vkPayments"

const app = new Elysia()
  .use(cors())
  // .use(
  //   trpc(router, {
  //     endpoint: "api",
  //     createContext,
  //     onError:
  //       Bun.env.TELEGRAM_TEST_ENV === "true"
  //         ? undefined
  //         : (opts) => {
  //             const { error } = opts

  //             console.error("Error:", error)
  //           },
  //   })
  // )
  .all("/api/*", async (opts) => {
    // TODO: workaround
    return await fetchRequestHandler({
      endpoint: "/api",
      router: router,
      req: opts.request,
      createContext,
    })
  })
  .use(vkPayments)
  .use(images)
  .listen(Bun.env.SERVER_PORT ?? 3000)

console.info(`Server is running at ${app.server?.hostname}:${app.server?.port}`)

export const elysia = treaty<typeof app>("localhost:3000")
