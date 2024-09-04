import Elysia from "elysia"
import { verifyVKSignature } from "./utils/calculateVkSignature"

// TODO: move vkPayments
export const vkPayments = new Elysia().post(
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
