import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { verifyVKWebAppData } from "./utils/verifyVKWebAppData"

type VKData = {
  vk_access_token_settings?: string
  vk_app_id?: string
  vk_are_notifications_enabled?: string
  vk_is_app_user?: string
  vk_is_favorite?: string
  vk_language?: string
  vk_platform?: string
  vk_ref?: string
  vk_testing_group_id?: string
  vk_ts?: string
  vk_user_id: string
  sign?: string
}

export const getQueryFromAuthorizationHeader = (
  authorization?: string | null
): {
  authorizationType: "vk"
  userId: number
  vkData: VKData
} | null => {
  const authorizationWithoutPrefix = authorization?.replace("Bearer ", "") ?? ""

  if (verifyVKWebAppData(authorizationWithoutPrefix)) {
    const data = Object.fromEntries(
      authorizationWithoutPrefix.split("&").map((entry) => entry.split("="))
    )

    return {
      authorizationType: "vk",
      userId: Number.parseInt(data.vk_user_id),
      vkData: data as VKData,
    }
  }

  return null
}

export const createContext = async ({ req }: FetchCreateContextFnOptions) => {
  const authorization = req.headers.get("authorization")

  return {
    queryData: getQueryFromAuthorizationHeader(authorization),
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
