import { elysia } from "@/shared/utils/trpc"
import { useMutation } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { useAuth } from "./useAuth"

export const useImageUpload = () => {
  const { id: projectIdParam } = useParams()
  const auth = useAuth()

  return useMutation({
    mutationFn: async (file?: File, projectId?: number) => {
      if (!file) throw new Error("No file provided")

      if (!projectIdParam && !projectId)
        throw new Error("No project id provided")

      return elysia.images.upload.post(
        {
          image: file,
          projectId: Number.parseInt((projectId ?? projectIdParam) as string),
        },
        {
          headers: {
            authorization: auth.authorizationHeader,
          },
        }
      )
    },
    mutationKey: ["imageUpload"],
  })
}
