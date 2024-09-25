import { trpc } from "@/shared/utils/trpc"
import { Icon24RefreshOutline } from "@vkontakte/icons"
import { Button, Placeholder } from "@vkontakte/vkui"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"

export const LoadingProjectsErrorPlaceholder = () => {
  const { t } = useTranslation()
  const utils = trpc.useUtils()

  const onRefetch = useCallback(() => {
    utils.project.getMany.refetch()
  }, [utils.project.getMany])

  return (
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
  )
}
