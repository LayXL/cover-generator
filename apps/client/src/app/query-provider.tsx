import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { httpBatchLink } from "@trpc/client"
import { type ReactNode, useState } from "react"
// import superjson from "superjson"

// const token = window.Telegram.WebApp.initData || window.location.search.slice(1)

export const QueryProvider = ({ children }: { children?: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())
  // const [trpcClient] = useState(() =>
  //   trpc.createClient({
  //     links: [
  //       httpBatchLink({
  //         transformer: superjson,
  //         url: "/api",
  //         async headers() {
  //           return {
  //             authorization: `Bearer ${token}`,
  //           }
  //         },
  //       }),
  //     ],
  //   })
  // )

  return (
    // <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    // </trpc.Provider>
  )
}
