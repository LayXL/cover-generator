import {
  Icon28ArrowUturnLeftOutline,
  Icon28ArrowUturnRightOutline,
  Icon28DeleteOutline,
} from "@vkontakte/icons"
import { IconButton, Input } from "@vkontakte/vkui"
import { useTranslation } from "react-i18next"

const CAN_UNDO = false

type CoverCarouselItemHeaderProps = {
  title?: string
  onRemove?: () => void
  onChangeTitle?: (title: string) => void
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
}

export const CoverCarouselItemHeader = (
  props: CoverCarouselItemHeaderProps
) => {
  const { t } = useTranslation()

  return (
    <div className="flex gap-3 h-[44px] items-center">
      <IconButton className="[&>*]:!p-0" onClick={props.onRemove}>
        <Icon28DeleteOutline
          color="currentColor"
          className="text-inversed/30"
        />
      </IconButton>
      <Input
        placeholder={t("untitled-cover-placeholder")}
        value={props.title}
        onChange={({ target: { value } }) =>
          props.onChangeTitle?.(value.slice(0, 32))
        }
      />
      {CAN_UNDO && (
        <div className="flex gap-1.5">
          <IconButton
            className="[&>*]:!p-0"
            onClick={props.onUndo}
            disabled={!props.canUndo}
          >
            <Icon28ArrowUturnLeftOutline
              color="currentColor"
              className="text-inversed/30"
            />
          </IconButton>
          <IconButton
            className="[&>*]:!p-0"
            onClick={props.onRedo}
            disabled={!props.canRedo}
          >
            <Icon28ArrowUturnRightOutline
              color="currentColor"
              className="text-inversed/30"
            />
          </IconButton>
        </div>
      )}
    </div>
  )
}
