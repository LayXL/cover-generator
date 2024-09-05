import { Editor } from "@/pages/editor"
import { Projects } from "@/pages/projects"
import { Outlet, createBrowserRouter } from "react-router-dom"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Projects />,
      },
      {
        path: "/projects/:id/editor",
        element: <Editor />,
      },
    ],
  },
])
