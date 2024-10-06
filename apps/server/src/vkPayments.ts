import { db } from "drizzle"
import { eq } from "drizzle-orm"
import { userPayments, userPurchases, users } from "drizzle/db/schema"
import Elysia from "elysia"
import { returnFirst } from "shared/returnFirst"
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

    const isTestNotification = notification.includes("test")

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
          const status = data.status as "chargeable" | "refund"

          console.log(1)

          const user = await db.query.users.findFirst({
            where: eq(users.vkId, Number(data.user_id)),
          })

          console.log(2)

          if (!user?.id) return error(500)

          console.log(3)

          if (data.item_id === "1" && status === "chargeable") {
            const payment = await db
              .insert(userPayments)
              .values({
                userId: user.id,
                paymentData: data,
                isTestPayment: isTestNotification,
              })
              .returning()
              .then(returnFirst)

            console.log(4)

            if (!payment?.id) return error(500)

            console.log(5)

            await db.insert(userPurchases).values({
              userId: user.id,
              purchaseId: 1,
              price: Number(data.item_price),
              purchaseData: data,
              isTestPurchase: isTestNotification,
            })

            console.log(6)

            response = {
              order_id: data.order_id,
              app_order_id: payment?.id.toString(),
            }

            console.log(7)
          }

          console.log(8)

          if (data.item_id === "1" && status === "refund") {
            // TODO: rewrite
            await db
              .delete(userPurchases)
              .where(eq(userPurchases.userId, user.id))

            response = {
              order_id: data.order_id,
            }
          }

          console.log("end")
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
