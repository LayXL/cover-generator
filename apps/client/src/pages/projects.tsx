import { ProjectCard } from "@/entities/project/ui/project-card"
import { Header } from "@/shared/ui/header"
import { Screen } from "@/shared/ui/screen"
import { repeatElement } from "@/shared/utils/repeatElement"
import { trpc } from "@/shared/utils/trpc"
import {
  Icon24Add,
  Icon24RefreshOutline,
  Icon56FragmentsOutline,
} from "@vkontakte/icons"
import { Button, Placeholder } from "@vkontakte/vkui"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const projectSkeleton = (
  <div className="w-full aspect-[4/3] animate-pulse bg-inversed/5 rounded-xl" />
)

export const Projects = () => {
  const { t } = useTranslation()
  const utils = trpc.useUtils()
  const navigate = useNavigate()

  const projects = trpc.project.getMany.useQuery()
  const deleteProject = trpc.project.deleteOne.useMutation({
    onSuccess: () => {
      utils.project.getMany.invalidate()
    },
  })
  const renameProject = trpc.project.rename.useMutation({
    onSuccess: () => {
      utils.project.getMany.invalidate()
    },
  })
  const createProject = trpc.project.create.useMutation({
    onSuccess: (data) => {
      if (!data) return

      utils.project.getMany.invalidate()
      navigate(`/projects/${data.id}/editor`)
    },
  })

  const onCreateProject = useCallback(() => {
    createProject.mutate()
  }, [createProject.mutate])

  const onRefetch = useCallback(() => {
    projects.refetch()
  }, [projects.refetch])

  const openEditor = useCallback(
    (projectId: number) => () => navigate(`/projects/${projectId}/editor`),
    [navigate]
  )

  return (
    <Screen className="pb-safe-area-bottom max-h-screen">
      <Header title={t("my-projects-title")} />

      {projects.isSuccess && projects.data.length > 0 && (
        <>
          <div className="grid gap-2 grid-cols-2 container mx-auto sm:grid-cols-3 lg:grid-cols-4 px-4 content-start flex-1 overflow-scroll">
            {projects.data.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                updatedAt={project.updatedAt}
                onClick={openEditor(project.id)}
                onDeleteWithConfirm={() => {
                  deleteProject.mutate({ id: project.id })
                }}
                onRename={(title) => {
                  renameProject.mutate({ id: project.id, title })
                }}
              />
            ))}
          </div>
          <div className="p-4">
            <Button
              size="l"
              stretched
              children={t("create-project-button")}
              onClick={onCreateProject}
            />
          </div>
        </>
      )}

      {projects.isSuccess && projects.data.length === 0 && (
        <Placeholder
          stretched
          className="min-h-full"
          header={t("no-projects-placeholder")}
          children={t("no-projects-placeholder.caption")}
          icon={<Icon56FragmentsOutline />}
          action={
            <Button
              before={<Icon24Add />}
              size="m"
              children={t("create-project-button")}
              onClick={onCreateProject}
            />
          }
        />
      )}

      {projects.isError && (
        <Placeholder
          stretched
          className="min-h-full"
          header={t("loading-projects-error-placeholder")}
          children={t("loading-projects-error-placeholder.caption")}
          action={
            <Button
              before={<Icon24RefreshOutline />}
              size="m"
              children={t("try-again-button")}
              onClick={onRefetch}
            />
          }
        />
      )}

      {projects.isLoading && (
        <div className="grid gap-2 grid-cols-2 container mx-auto sm:grid-cols-3 lg:grid-cols-4 p-4">
          {repeatElement(projectSkeleton, 20)}
        </div>
      )}
    </Screen>
  )
}
