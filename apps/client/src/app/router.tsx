import { createBrowserRouter, Outlet } from "react-router-dom"
import { Editor } from "../pages/editor"
import { Projects } from "../pages/projects"

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
        path: "/editor",
        element: <Editor />,
      },
    ],
  },
])
