import { trpc } from "@/shared/utils/trpc"
import { Button } from "@vkontakte/vkui"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export const BottomProjectsBar = () => {
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
    <div className="p-4">
      <Button
        size="l"
        stretched
        children={t("create-project-button")}
        onClick={onCreateProject}
        loading={createProject.isPending}
      />
    </div>
  )
}
