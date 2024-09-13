import { elysia } from "@/shared/utils/trpc"
import { type UseMutationOptions, useMutation } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { useAuth } from "./useAuth"

type UploadImageVariables = {
  file?: File
  projectId?: number
}

export const useImageUpload = (
  options?: UseMutationOptions<
    Awaited<ReturnType<(typeof elysia)["images"]["upload"]["post"]>>,
    Error,
    UploadImageVariables
  >
) => {
  const { id: projectIdParam } = useParams()
  const auth = useAuth()

  return useMutation({
    mutationFn: async ({ file, projectId }: UploadImageVariables) => {
      if (!file) throw new Error("No file provided")

      const id =
        projectId ??
        (projectIdParam ? Number.parseInt(projectIdParam) : undefined)

      if (!id) throw new Error("No project id provided")

      return elysia.images.upload.post(
        {
          image: file,
          projectId: id,
        },
        { headers: { authorization: auth.authorizationHeader } }
      )
    },
    mutationKey: ["imageUpload"],
    ...options,
  })
}
