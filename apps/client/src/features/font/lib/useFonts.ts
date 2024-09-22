import { useQuery } from "@tanstack/react-query"

export const useFonts = () =>
  useQuery({
    staleTime: Number.POSITIVE_INFINITY,
    queryKey: ["fonts"],
    queryFn: () =>
      fetch("/fonts.json").then(
        (res) =>
          res.json() as Promise<
            {
              type: string
              name: string
              font: string
              install: {
                import?: string
                file?: string
              }
            }[]
          >
      ),
  })
