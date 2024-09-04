import { cors } from "@elysiajs/cors"
import { treaty } from "@elysiajs/eden"
import { trpc } from "@elysiajs/trpc"
import { Elysia } from "elysia"
import { createContext } from "./context"
import { images } from "./images"
import { router } from "./routes"
import { vkPayments } from "./vkPayments"

const app = new Elysia()
  .use(cors())
  .use(vkPayments)
  .use(images)
  .use(
    trpc(router, {
      endpoint: "/api",
      createContext,
      onError:
        Bun.env.TELEGRAM_TEST_ENV === "true"
          ? undefined
          : (opts) => {
              const { error } = opts

              console.error("Error:", error)
            },
    })
  )
  .listen(Bun.env.SERVER_PORT ?? 3000)

console.info(`Server is running at ${app.server?.hostname}:${app.server?.port}`)

export const elysia = treaty<typeof app>("localhost:3000")
