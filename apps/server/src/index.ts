import { cors } from "@elysiajs/cors"
import { trpc } from "@elysiajs/trpc"
import { Elysia } from "elysia"
import { createContext } from "./context"
import { router } from "./routes"
import { verifyVKSignature } from "./utils/calculateVkSignature"

// TODO: move vkPayments
const vkPayments = new Elysia().post(
  "/purchase",
  async ({ request, body, error }) => {
    const data = body as Record<string, string>

    if (!verifyVKSignature(data)) return error(10)

    const notification = data.notification_type as
      | "get_item"
      | "get_item_test"
      | "order_status_change"
      | "order_status_change_test"

    switch (notification) {
      case "get_item":
      case "get_item_test":
        return
      case "order_status_change":
      case "order_status_change_test":
        return
      default:
        return error(500)
    }
  }
)

const app = new Elysia()
  .use(cors())
  .use(vkPayments)
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
