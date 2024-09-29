import { db } from "drizzle"
import { and, eq } from "drizzle-orm"
import { media, projects, users } from "drizzle/db/schema"
import Elysia, { t } from "elysia"
import sharp from "sharp"
import { v4 as uuidv4 } from "uuid"
import { getQueryFromAuthorizationHeader } from "./context"
import { escapePath } from "./utils/escapePath"

export const images = new Elysia().group("/images", (group) =>
  group
    .post(
      "/upload",
      async ({ body: { image, projectId }, headers, error }) => {
        const queryData = getQueryFromAuthorizationHeader(headers.authorization)

        if (!queryData) return error("Forbidden")

        const user = await db.query.users.findFirst({
          where: eq(users.vkId, queryData.userId),
        })

        if (!user) return error("Forbidden")

        const parsedProjectId =
          typeof projectId === "number" ? projectId : Number.parseInt(projectId)

        const project = await db.query.projects.findFirst({
          where: and(
            eq(projects.id, parsedProjectId),
            eq(projects.authorId, user.id)
          ),
        })

        if (!project) return error("Not Found")

        const uuid = uuidv4()

        const sharpImage = await sharp(await image.arrayBuffer())

        const metadata = await sharpImage.metadata()

        if ((metadata.width ?? 0) > 376 || (metadata.height ?? 0) > 256) {
          sharpImage.resize({ width: 376, height: 256, fit: "outside" })
        }

        const convertedImage = await sharpImage
          .webp({ quality: 80 })
          .toFile(`./images/${uuid}.webp`)

        await db.insert(media).values({
          uuid,
          authorId: user.id,
          projectId: parsedProjectId,
          width: convertedImage.width,
          height: convertedImage.height,
        })

        return {
          uuid,
          url: `/images/${uuid}`,
          width: convertedImage.width,
          height: convertedImage.height,
        }
      },
      {
        headers: t.Object({
          authorization: t.String(),
        }),
        type: "multipart/form-data",
        body: t.Object({
          projectId: t.Union([t.Number(), t.String()]),
          image: t.File({
            type: ["image/jpeg", "image/png", "image/webp", "image/*"],
            maxSize: "5m",
          }),
        }),
      }
    )
    .get("/:uuid", ({ params: { uuid } }) =>
      Bun.file(`./images/${escapePath(uuid)}.webp`)
    )
)
