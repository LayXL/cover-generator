import { trpc } from "@/shared/utils/trpc"
import { Icon24Add, Icon56FragmentsOutline } from "@vkontakte/icons"
import { Button, Placeholder } from "@vkontakte/vkui"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export const NoProjectsPlaceholder = () => {
  const { t } = useTranslation()
  const utils = trpc.useUtils()
  const navigate = useNavigate()

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

  return (
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
          loading={createProject.isPending}
        />
      }
    />
  )
}
