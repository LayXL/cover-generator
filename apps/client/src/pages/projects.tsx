import { Header } from "@/shared/ui/header"
import { Screen } from "@/shared/ui/screen"
import { Icon24Add } from "@vkontakte/icons"
import { Button, Placeholder } from "@vkontakte/vkui"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export const Projects = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const onCreateProject = useCallback(() => {
    navigate("/projects/1/editor")
  }, [navigate])

  return (
    <Screen>
      <Header title={t("my-projects-title")} />

      <Placeholder
        className="min-h-full"
        stretched
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
    </Screen>
  )
}
