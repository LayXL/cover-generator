import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import bridge from "@vkontakte/vk-bridge"
import superjson from "superjson"
import { isTelegram, isVK } from "../utils/platform-detect"

export const useCloudStorage = <T>(key: string, defaultValue: T) => {
  const queryClient = useQueryClient()

  return [
    useQuery({
      queryKey: ["cloud", key],
      queryFn: (): Promise<T> =>
        new Promise((resolve) => {
          isTelegram
            ? window.Telegram?.WebApp.CloudStorage.getItem(
                key,
                (error: string, value: string) => {
                  if (error) throw new Error(error)

                  if (!value || value.length === 0) resolve(defaultValue)

                  resolve(superjson.parse(value))
                }
              )
            : isVK
              ? bridge
                  .send("VKWebAppStorageGet", {
                    keys: [key],
                  })
                  .then((result) => {
                    const value = result.keys[0].value

                    if (!value || value.length === 0) resolve(defaultValue)
                    else resolve(superjson.parse(value))
                  })
                  .catch((error) => {
                    throw new Error(error)
                  })
              : defaultValue
        }),
    }),
    useMutation({
      mutationKey: ["cloud", key],
      mutationFn: async (value: T) => {
        queryClient.setQueryData(["cloud", key], value)

        if (isTelegram) {
          await window.Telegram?.WebApp.CloudStorage.setItem(
            key,
            superjson.stringify(value)
          )
        } else if (isVK) {
          await bridge.send("VKWebAppStorageSet", {
            key: key,
            value: superjson.stringify(value),
          })
        }
      },
    }),
    useMutation({
      mutationKey: ["cloud", key, "reset"],
      mutationFn: async () => {
        queryClient.setQueryData(["cloud", key], defaultValue)

        if (isTelegram) {
          await window.Telegram?.WebApp.CloudStorage.setItem(
            key,
            superjson.stringify(defaultValue)
          )
        } else if (isVK) {
          await bridge.send("VKWebAppStorageSet", {
            key: key,
            value: superjson.stringify(defaultValue),
          })
        }
      },
    }),
  ] as const
}
