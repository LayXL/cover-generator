import { Outlet, createBrowserRouter } from "react-router-dom"

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
        // element: <Editor />,
        lazy: async () => ({
          Component: (await import("@/pages/editor")).Editor,
        }),
      },
    ],
  },
])
