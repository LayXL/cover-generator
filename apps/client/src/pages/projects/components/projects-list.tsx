import { ProjectCard } from "@/entities/project/ui/project-card"
import { cn } from "@/shared/utils/cn"
import { type RouterOutput, trpc } from "@/shared/utils/trpc"
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"

type ProjectsListProps = {
  data: RouterOutput["project"]["getMany"]
}

export const ProjectsList = (props: ProjectsListProps) => {
  const utils = trpc.useUtils()
  const navigate = useNavigate()

  const deleteProject = trpc.project.deleteOne.useMutation({
    onSuccess: () => utils.project.getMany.invalidate(),
  })

  const renameProject = trpc.project.rename.useMutation({
    onSuccess: () => utils.project.getMany.invalidate(),
  })

  const openEditor = useCallback(
    (projectId: number) => () => navigate(`/projects/${projectId}/editor`),
    [navigate]
  )

  return (
    <div
      className={cn(
        "grid gap-2 w-full max-w-screen-md mx-auto px-4 content-start flex-1 overflow-scroll",
        "grid-cols-1 xs:grid-cols-2",
        props.data.length > 3 && "grid-cols-2 sm:grid-cols-3"
      )}
    >
      {props.data.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          updatedAt={project.updatedAt}
          onClick={openEditor(project.id)}
          onDeleteWithConfirm={() => deleteProject.mutate({ id: project.id })}
          onRename={(title) => renameProject.mutate({ id: project.id, title })}
        />
      ))}
    </div>
  )
}
