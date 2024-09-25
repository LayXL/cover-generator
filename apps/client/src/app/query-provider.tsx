import { AuthProvider } from "@/shared/hooks/use-auth"
import { trpc } from "@/shared/utils/trpc"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import bridge from "@vkontakte/vk-bridge"
import { type ReactNode, useEffect, useMemo, useState } from "react"
import superjson from "superjson"

type QueryProviderType = {
  children?: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderType) => {
  const [token, setToken] = useState(() => window.location.search.slice(1))

  useEffect(() => {
    bridge.send("VKWebAppGetLaunchParams").then((data) => {
      const sortedKeys = Object.keys(data).sort() as (keyof typeof data)[]

      setToken(sortedKeys.map((key) => `${key}=${data[key]}`).join("&"))
    })
  }, [])

  const [queryClient] = useState(() => new QueryClient())
  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            transformer: superjson,
            url: "/api",
            headers() {
              return { authorization: `Bearer ${token}` }
            },
          }),
        ],
      }),
    [token]
  )

  return (
    <AuthProvider value={{ token }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </AuthProvider>
  )
}
