import { Header } from "@/shared/ui/header"
import { Screen } from "@/shared/ui/screen"
import { repeatElement } from "@/shared/utils/repeatElement"
import { trpc } from "@/shared/utils/trpc"
import { Icon24Add, Icon24RefreshOutline } from "@vkontakte/icons"
import { Button, Placeholder } from "@vkontakte/vkui"
import { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useScrollLock } from "usehooks-ts"

const projectSkeleton = (
  <div className="w-full aspect-[4/3] animate-pulse bg-inversed/5 rounded-xl" />
)

export const Projects = () => {
  const { lock, unlock } = useScrollLock()
  const { t } = useTranslation()
  const utils = trpc.useUtils()
  const navigate = useNavigate()

  const projects = trpc.project.getMany.useQuery()
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

  useEffect(() => {
    if (projects.isSuccess) unlock()
    else lock()
  }, [projects.isSuccess, lock, unlock])

  return (
    <Screen>
      <Header title={t("my-projects-title")} />

      {projects.isSuccess && projects.data.length > 0 && (
        <div className="grid gap-2 grid-cols-2 container mx-auto sm:grid-cols-3 lg:grid-cols-4 p-4">
          {projects.data.map((project) => (
            <button
              type="button"
              key={project.id}
              className="w-full aspect-[4/3] bg-inversed/5 rounded-xl"
              onClick={() => navigate(`/projects/${project.id}/editor`)}
            />
          ))}
        </div>
      )}

      {projects.isSuccess && projects.data.length === 0 && (
        <Placeholder
          stretched
          className="min-h-full"
          header={t("no-projects-placeholder")}
          children={t("no-projects-placeholder.caption")}
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
