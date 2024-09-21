import path from "node:path"
import Elysia from "elysia"
import type { Emoji } from "shared/types"
import { escapePath } from "./utils/escapePath"

export const emojis = new Elysia().group("/emojis", (group) =>
  group
    .get("/", async () => {
      console.log(true)

      const emojis = JSON.parse(
        await Bun.file("./src/emojis.json").text()
      ) as Emoji[]

      return emojis
        .filter((emoji) => {
          if (emoji.category === "Flags") return false
          if (emoji.subcategory === "person-symbol") return false
          if (emoji.subcategory === "family") return false

          return true
        })
        .toSorted((a, b) => a.sort_order - b.sort_order)
    })
    .get("/:emoji", async ({ params: { emoji }, set }) => {
      set.headers = {
        "cache-control": "public, max-age=31536000, immutable",
      }

      return Bun.file(
        path.join(
          __dirname,
          "../../../node_modules",
          `emoji-datasource-apple/img/apple/64/${escapePath(emoji)}.png`
        )
      )
    })
)
