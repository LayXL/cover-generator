import { trpc } from "@/shared/utils/trpc"
import { Button } from "@vkontakte/vkui"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

type BottomProjectsBarProps = {
  createdProjectsCount?: number
}

export const BottomProjectsBar = (props: BottomProjectsBarProps) => {
  const { t } = useTranslation()
  const utils = trpc.useUtils()
  const navigate = useNavigate()

  const premium = trpc.user.premium.useQuery()

  const createProject = trpc.project.create.useMutation({
    onSuccess: (data) => {
      utils.project.getMany.invalidate()
      navigate(`/projects/${data.id}/editor`)
    },
  })

  const onCreateProject = useCallback(() => {
    createProject.mutate()
  }, [createProject.mutate])

  const isButtonDisabled =
    !!premium.data?.maxCreatedProjects &&
    !!props.createdProjectsCount &&
    props.createdProjectsCount >= premium.data.maxCreatedProjects

  return (
    <div className="p-4">
      <Button
        size="l"
        stretched
        children={t("create-project-button")}
        onClick={onCreateProject}
        loading={createProject.isPending}
        disabled={isButtonDisabled}
      />
    </div>
  )
}
