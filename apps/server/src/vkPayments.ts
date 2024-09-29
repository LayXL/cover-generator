import { db } from "drizzle"
import { eq } from "drizzle-orm"
import { users } from "drizzle/db/schema"
import Elysia from "elysia"
import { verifyVKSignature } from "./utils/calculateVkSignature"

type Response =
  | {
      title: string
      price: number
      photo_url?: string
      item_id: string
      expiration: number
    }
  | {
      order_id: string
      app_order_id: string
    }
  | {
      order_id: string
    }

export const vkPayments = new Elysia().post(
  "/purchase",
  async ({ body, error }) => {
    const data = body as Record<string, string>

    if (!verifyVKSignature(data)) return error(10)

    const notification = data.notification_type as
      | "get_item"
      | "get_item_test"
      | "order_status_change"
      | "order_status_change_test"

    let response: Response | undefined = undefined

    switch (notification) {
      case "get_item":
      case "get_item_test":
        response = {
          title: "Premium",
          price: 100,
          item_id: "premium",
          expiration: 0,
        }
        break
      case "order_status_change":
      case "order_status_change_test":
        {
          console.log(data)

          const status = data.status as "chargeable" | "refund"

          const user = await db.query.users.findFirst({
            where: eq(users.vkId, Number(data.user_id)),
          })

          if (!user?.id) return error(500)
        }
        break
      default:
        return error(500)
    }

    if (response) {
      return { response }
    }
  }
)
