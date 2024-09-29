import { Suspense } from "react"
import { Outlet, createBrowserRouter } from "react-router-dom"
import { FallbackEditor } from "./fallback/editor"
import { LazyEditor } from "./lazy/editor"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("@/pages/projects")).Projects,
        }),
      },
      {
        path: "/projects/:id/editor",
        element: (
          <Suspense fallback={<FallbackEditor />}>
            <LazyEditor />
          </Suspense>
        ),
      },
      {
        path: "/premium",
        lazy: async () => ({
          Component: (await import("@/pages/premium")).Premium,
        }),
      },
    ],
  },
])
