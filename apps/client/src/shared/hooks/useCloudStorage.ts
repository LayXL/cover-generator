import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import bridge from "@vkontakte/vk-bridge"
import superjson from "superjson"

export const useCloudStorage = <T>(key: string, defaultValue: T) => {
  const queryClient = useQueryClient()

  return [
    useQuery({
      queryKey: ["cloud", key],
      queryFn: (): Promise<T> =>
        new Promise((resolve) => {
          bridge
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
        }),
    }),
    useMutation({
      mutationKey: ["cloud", key],
      mutationFn: async (value: T) => {
        queryClient.setQueryData(["cloud", key], value)

        await bridge.send("VKWebAppStorageSet", {
          key: key,
          value: superjson.stringify(value),
        })
      },
    }),
    useMutation({
      mutationKey: ["cloud", key, "reset"],
      mutationFn: async () => {
        queryClient.setQueryData(["cloud", key], defaultValue)

        await bridge.send("VKWebAppStorageSet", {
          key: key,
          value: superjson.stringify(defaultValue),
        })
      },
    }),
  ] as const
}
