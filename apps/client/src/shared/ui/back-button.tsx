import { PanelHeaderBack } from "@vkontakte/vkui"
import { useNavigate } from "react-router-dom"

type BackButtonProps = {
  onClick?: () => void
}

export const BackButton = (props: BackButtonProps) => {
  const navigate = useNavigate()

  return (
    <PanelHeaderBack
      onClick={props.onClick ?? (() => navigate(-1))}
      className="!text-accent"
    />
  )
}
