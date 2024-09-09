import { Icon24ChevronLeft } from "@vkontakte/icons"
import { IconButton } from "@vkontakte/vkui"
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"

type BackButtonProps = {
  onClick?: () => void
}

export const BackButton = (props: BackButtonProps) => {
  const navigate = useNavigate()

  const onClick = useCallback(() => {
    if (props.onClick) props.onClick()
    else navigate(-1)
  }, [navigate, props.onClick])

  return (
    <IconButton onClick={onClick} className="!text-accent">
      <Icon24ChevronLeft />
    </IconButton>
  )
}
