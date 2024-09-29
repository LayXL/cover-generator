import { useModalState } from "@/shared/hooks/use-modal-state"
import { Modal } from "@/shared/ui/modal"
import { trpc } from "@/shared/utils/trpc"
import { Icon56DiamondOutline } from "@vkontakte/icons"
import { Button, ModalCardBase } from "@vkontakte/vkui"
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

  const premiumModal = useModalState()

  return (
    <>
      <div className="p-4">
        <Button
          size="l"
          stretched
          children={t("create-project-button")}
          onClick={!isButtonDisabled ? onCreateProject : premiumModal.open}
          loading={createProject.isPending}
        />
      </div>
      <Modal {...premiumModal} mode="card">
        <ModalCardBase
          onClose={premiumModal.close}
          icon={<Icon56DiamondOutline />}
          header={t("premium-modal-title")}
          subheader={t("premium-modal-more-projects-subtitle")}
          actions={
            <Button
              size="l"
              stretched
              children={t("premium-modal-button")}
              onClick={() => navigate("/premium")}
            />
          }
        />
      </Modal>
    </>
  )
}
