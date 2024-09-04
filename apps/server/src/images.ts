import Elysia, { t } from "elysia"
import sharp from "sharp"
import { v4 as uuidv4 } from "uuid"
import { escapePath } from "./utils/escapePath"

export const images = new Elysia().group("/images", (group) =>
  group
    .post(
      "/upload",
      async ({ body: { image } }) => {
        const uuid = uuidv4()

        await sharp(await image.arrayBuffer())
          .webp({ quality: 80 })
          .toFile(`./images/${uuid}.webp`)

        return {
          url: `/images/${uuid}.webp`,
        }
      },
      {
        type: "multipart/form-data",
        body: t.Object({
          image: t.File({
            type: ["image/jpeg", "image/png", "image/webp"],
            maxSize: "5m",
          }),
        }),
      }
    )
    .get(":uuid", ({ params: { uuid } }) =>
      Bun.file(`./images/${escapePath(uuid)}.webp`)
    )
)
