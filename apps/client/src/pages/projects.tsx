import { PanelHeader } from "@vkontakte/vkui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export const Projects = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div>
      <PanelHeader delimiter="none" children={t("myProjectsTitle")} />

      <button type="button" onClick={() => navigate("/projects/1/editor")}>
        New project
      </button>
    </div>
  )
}
