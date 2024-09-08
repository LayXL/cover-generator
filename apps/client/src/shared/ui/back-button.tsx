import { PanelHeaderBack } from "@vkontakte/vkui"
import { useNavigate } from "react-router-dom"

export const BackButton = () => {
  const navigate = useNavigate()

  return <PanelHeaderBack onClick={() => navigate(-1)} />
}
