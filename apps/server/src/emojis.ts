import path from "node:path"
import Elysia from "elysia"
import { escapePath } from "./utils/escapePath"

export const emojis = new Elysia().group("/emojis", (group) =>
  group.get("/:emoji", async ({ params: { emoji }, set }) => {
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
