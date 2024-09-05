import { getAuthorizationHeader } from "@/shared/utils/getAuthorizationHeader"
import { trpc } from "@/shared/utils/trpc"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { type ReactNode, useState } from "react"
import superjson from "superjson"

type QueryProviderType = {
  children?: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderType) => {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: "/api",
          headers() {
            return {
              authorization: getAuthorizationHeader(),
            }
          },
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
