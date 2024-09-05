import { encode } from "blurhash"
import { db } from "drizzle"
import { and, eq } from "drizzle-orm"
import { media } from "drizzle/db/schema"
import Elysia, { t } from "elysia"
import sharp from "sharp"
import { v4 as uuidv4 } from "uuid"
import { getQueryFromAuthorizationHeader } from "./context"
import { escapePath } from "./utils/escapePath"
import { fileToUint8ClampedArray } from "./utils/fileToUint8ClampedArray"

export const images = new Elysia().group("/images", (group) =>
  group
    .post(
      "/upload",
      async ({ body: { image, projectId }, headers, error }) => {
        const queryData = getQueryFromAuthorizationHeader(headers.authorization)

        if (!queryData) return error("Forbidden")

        const project = await db.query.projects.findFirst({
          where: and(
            eq(media.authorId, queryData.userId),
            eq(media.projectId, projectId)
          ),
        })

        if (!project) return error("Not Found")

        const uuid = uuidv4()

        const convertedImage = await sharp(await image.arrayBuffer())
          .webp({ quality: 80 })
          .toFile(`./images/${uuid}.webp`)

        db.insert(media).values({
          uuid,
          authorId: queryData.userId,
          projectId,
          width: convertedImage.width,
          height: convertedImage.height,
          blurhash: encode(
            await fileToUint8ClampedArray(image),
            convertedImage.width,
            convertedImage.height,
            4,
            4
          ),
        })

        return {
          url: `/images/${uuid}.webp`,
        }
      },
      {
        headers: t.Object({
          authorization: t.String(),
        }),
        type: "multipart/form-data",
        body: t.Object({
          projectId: t.Number(),
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
